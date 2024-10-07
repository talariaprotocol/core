import { useCallback } from "react";
import { AlertTriangle, Download } from "lucide-react";
import { Alert, AlertDescription } from "~~/components/ui/alert";
import { Button } from "~~/components/ui/button";

interface DownloadCodesProps {
  generatedCodes: string[];
  isGeneratingCodes: boolean;
  chainId: number;
  protocol: string;
}

const DownloadCodes = ({ generatedCodes, isGeneratingCodes, chainId, protocol }: DownloadCodesProps) => {
  const downloadCSV = useCallback(() => {
    const generatedUrls = generatedCodes.map(
      code => `${process.env.NEXT_PUBLIC_APP_URL}/whitelist/${chainId}/${protocol}/redeem#${code}`,
    );
    const csvContent = generatedUrls.join("\n");
    const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "talaria_generated_codes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedCodes, protocol]);

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      {generatedCodes.length > 0 && (
        <Alert variant="warning" className="animate-zoomIn">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Do not refresh the page, or all created codes will be lost.</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={downloadCSV}
        className="whitespace-nowrap md:ml-auto flex gap-2 items-center"
        size="lg"
        disabled={isGeneratingCodes}
        type="button"
      >
        <Download className="h-4 w-4" />
        Download codes as CSV
      </Button>
    </div>
  );
};

export default DownloadCodes;
