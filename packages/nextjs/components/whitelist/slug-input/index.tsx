import { useEffect, useMemo, useState } from "react";
import { CheckIcon, Loader2 } from "lucide-react";
import { isAddress } from "viem";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { getWhitelistAction } from "~~/repository/whitelist/getWhitelist.action";

const validateSlug = (slug?: string) =>
  slug && slug.length >= 3 && !slug.startsWith("-") && !slug.endsWith("-") && !isAddress(slug);

const SlugInput = ({ slug, setSlug }: { slug: string; setSlug: (newValue: string) => void }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isUnique, setIsUnique] = useState(true);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");

    if (newSlug === slug) return;

    setIsChecking(true);
    setSlug(newSlug);
  };

  useEffect(() => {
    setIsUnique(true);
    const handler = setTimeout(async () => {
      if (validateSlug(slug)) {
        const existingWhitelist = await getWhitelistAction({ slug });
        setIsUnique(!existingWhitelist);
      }
      setIsChecking(false);
    }, 1000); // 2 second debounce

    return () => {
      clearTimeout(handler);
    };
  }, [slug]);

  const errorMessage = useMemo(() => {
    const isValidSlug = validateSlug(slug) && isUnique;
    if (isValidSlug) return;

    const defaultText = "Slug must be at least 3 characters and cannot start or end with a hyphen.";
    const notUniqueSlug = "This slug is taken, please try another one.";

    if (!isUnique) {
      return notUniqueSlug;
    }

    return defaultText;
  }, [slug, isUnique]);

  return (
    <>
      <Label htmlFor="slug">Slug</Label>
      <Input
        id="slug"
        type="text"
        value={slug}
        onChange={handleSlugChange}
        placeholder="talaria-protocol"
        endIcon={
          isChecking && slug ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            isUnique && validateSlug(slug) && <CheckIcon color="green" />
          )
        }
      />
      {errorMessage && slug && !isChecking && <p className="text-sm text-red-500">{errorMessage}</p>}
      <p className="text-sm text-muted-foreground">app.talariaprotocol.xyz/{slug || "[slug]"}</p>
    </>
  );
};

export default SlugInput;
