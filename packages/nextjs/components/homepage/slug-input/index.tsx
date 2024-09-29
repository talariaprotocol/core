import { useState } from "react";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";

// Updated regex for URL slugs
// Allows lowercase letters, numbers, and hyphens
// Must be at least 3 characters long

const SlugInput = ({ slug, setSlug }: { slug: string; setSlug: (slug: string) => void }) => {
  const [showError, setShowError] = useState(false);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSlug(newSlug);
    setShowError(false);
  };

  const handleBlur = () => {
    setShowError(true);
  };

  const isValidSlug = slug.length >= 3 && !slug.startsWith("-") && !slug.endsWith("-");

  return (
    <>
      <Label htmlFor="slug">Slug</Label>
      <Input
        id="slug"
        type="text"
        value={slug}
        onChange={handleSlugChange}
        onBlur={handleBlur}
        required
        placeholder="talaria-protocol"
      />
      {showError && slug && !isValidSlug && (
        <p className="text-sm text-red-500">
          Slug must be at least 3 characters and cannot start or end with a hyphen.
        </p>
      )}
      <p className="text-sm text-muted-foreground">app.talariaprotocol.xyz/{slug || "[slug]"}</p>
    </>
  );
};

export default SlugInput;
