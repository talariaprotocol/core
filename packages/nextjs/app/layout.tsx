import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import Footer from "~~/components/footer";
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
              <TooltipProvider>
                <Navigation />
                <main className="flex-1 flex justify-center bg-background py-8 px-2 md:px-20 mt-20">
                  {children}
                  <Toaster />
                </main>
                <Footer />
              </TooltipProvider>
            </div>
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
