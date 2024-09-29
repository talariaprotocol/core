import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";

const Landing = ({ showDocs }: { showDocs: boolean }) => {
  const [activeTab, setActiveTab] = useState("about");
  const forcedDocsRef = useRef(false);

  useEffect(() => {
    if (showDocs) {
      setActiveTab("docs");
      forcedDocsRef.current = true;
    }
  }, [showDocs]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-4 w-full h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="about">About Talaria</TabsTrigger>
        <TabsTrigger value="docs" className={`${forcedDocsRef.current ? "animate-ping" : ""}`}>
          Integration Guide
        </TabsTrigger>
      </TabsList>
      <Card className="flex-1 relative overflow-scroll p-0">
        <TabsContent value="about">
          <CardHeader className="p-6">
            <CardTitle>Talaria</CardTitle>
            <CardDescription>The First On-Chain Address-Free Access Protocol</CardDescription>
          </CardHeader>
          <CardContent className="md:absolute w-full p-6">
            <div className="space-y-4">
              <section>
                <p className="">
                  Empower millions of protocols for their daily needs like whitelists, airdrops, and more - without the
                  hassle of managing addresses.
                </p>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Key Features</h3>
                <ul className="list-disc list-inside">
                  <li>Address-Free Access: Engage users without requiring their addresses</li>
                  <li>Scalable Solutions: Perfect for managing large audiences</li>
                  <li>Versatile Use Cases: Ideal for whitelists, airdrops, gift cards, and more</li>
                </ul>
              </section>
              <section>
                <p>
                  Ready to revolutionize your dApp's user experience? Explore our documentation to learn how to
                  integrate Talaria into your projects.
                </p>
              </section>
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="docs">
          <CardHeader className="p-6">
            <CardTitle>Quick Integration Guide</CardTitle>
            <CardDescription>Add Talaria to your project in 3 simple steps</CardDescription>
          </CardHeader>
          <CardContent className="md:absolute w-full p-6">
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-semibold">1. Whitelist Manager</h3>
                <p>Create the whitelist security layer</p>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                  <code>{`
interface IWhitelist {
    function usersWhitelisted(address user) external view returns (bool);
}

IWhitelist public whitelist;

constructor(address _whitelist) {
  whitelist = IWhitelist(_whitelist);
  betaAccessEnabled = true;
}
                  `}</code>
                </pre>
              </section>
              <section>
                <h3 className="text-lg font-semibold">2. Modifier</h3>
                <p>
                  Create the modifier to check if the user is whitelisted. You can also add a{" "}
                  <code className="text-sm">betaAccessEnabled</code> flag to control access.
                </p>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                  <code>{`
modifier onlyWhitelisted() {
  if (betaAccessEnabled && !whitelist.usersWhitelisted(msg.sender)) {
    revert UserNotWhitelistedAndBetaAccessIsEnabled();
  }
  _;
}
                  `}</code>
                </pre>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Usage Example</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                  <code>{`
function test() public view onlyWhitelisted {
  // Your logic here
}
                  `}</code>
                </pre>
              </section>
              <p className="text-sm italic">That's it! You now have Talaria-powered access control in your contract.</p>
              <section className="mt-4">
                <h3 className="text-lg font-semibold">Need more details?</h3>
                <p>
                  For full integration instructions and advanced features, visit our{" "}
                  <a
                    href="https://docs.talariaprotocol.xyz/whitelists/how-to-integrate-a-whitelist-to-my-protocol"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    documentation
                  </a>
                  .
                </p>
              </section>
            </div>
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default Landing;
