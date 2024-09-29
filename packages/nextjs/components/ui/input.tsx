import * as React from "react";
import Image from "next/image";
import { Button } from "./button";
import { Upload } from "lucide-react";
import { cn } from "~~/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  if (type === "file") {
    return (
      <div className="flex gap-4 items-center">
        {previewImage ? (
          <Image src={previewImage} alt="File preview" className="object-contain" width={64} height={64} />
        ) : (
          <div className="p-2 bg-muted flex items-center justify-center rounded-md">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={el => {
            fileInputRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          onChange={handleFileChange}
          {...props}
        />
        <Button type="button" onClick={() => fileInputRef.current?.click()} className={cn("mr-2", className)}>
          <span className="text-sm text-muted">{fileInputRef.current?.files?.[0]?.name || "Choose File"}</span>
        </Button>
      </div>
    );
  }

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
