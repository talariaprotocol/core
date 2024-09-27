import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { Navigation } from "~~/components/navigation";
import { Toaster } from "~~/components/ui/toaster";
import { TooltipProvider } from "~~/components/ui/tooltip";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Talaria",
  description: "Descentralized access control for your smart contracts",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <TooltipProvider>
                <main className="container flex-1 flex justify-center items-center bg-muted/40">
                  {children}
                  <Toaster />
                </main>
              </TooltipProvider>
            </div>
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
