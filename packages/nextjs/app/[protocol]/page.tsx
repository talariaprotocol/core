"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertTriangle, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { useToast } from "~~/components/ui/use-toast";
import { uppercaseFirstLetter } from "~~/utils";

export default function CodeGenerator({ params: { protocol } }: { params: { protocol: string } }) {
  const [codeCount, setCodeCount] = useState("");
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const { toast } = useToast();

  const generateCodes = (count: number) => {
    const codes = Array.from({ length: count }, () => Math.random().toString(36).substring(2, 10).toUpperCase());
    setGeneratedCodes(codes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(codeCount);
    if (!isNaN(count) && count > 0) {
      // TODO: Generate codes in blockchain
      generateCodes(count);
    }

    toast({
      title: "Talaria Codes generated",
    });
  };

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + generatedCodes.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "talaria_generated_codes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image src="/placeholder.svg" alt="Company Logo" width={100} height={100} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold">{uppercaseFirstLetter(protocol)}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="codeCount">Number of Codes to Generate</Label>
            <Input
              id="codeCount"
              type="number"
              value={codeCount}
              onChange={e => setCodeCount(e.target.value)}
              placeholder="Enter number of codes"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Generate Codes
          </Button>
        </form>

        <Alert variant="default">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Do not refresh the page, or all created codes will be lost.</AlertDescription>
        </Alert>

        {generatedCodes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Codes:</h3>
            <Button onClick={downloadCSV} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download as CSV
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
