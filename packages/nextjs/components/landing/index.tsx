import React, { useState } from "react";
import { Card, CardContent } from "~~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";

const Landing = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-4 max-w-lg">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="about">About Talaria</TabsTrigger>
        <TabsTrigger value="docs">Integration Guide</TabsTrigger>
      </TabsList>
      <Card>
        <CardContent>
          <TabsContent value="about">
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-semibold">What is Talaria?</h3>
                <p>
                  Talaria is an advanced access management protocol designed for blockchain applications. It provides a
                  unique approach to whitelist management and user access control.
                </p>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Key Features</h3>
                <ul className="list-disc list-inside">
                  <li>Easy integration with existing smart contracts</li>
                  <li>No need for user wallet addresses in advance</li>
                  <li>Flexible and secure access control</li>
                  <li>Customizable for various use cases</li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold">How it Works</h3>
                <p>
                  Talaria provides a base contract that your protocol can extend. This contract includes built-in
                  whitelist functionality, allowing you to easily manage access to your protocol's features.
                </p>
                <p>
                  By integrating Talaria, you can focus on your core functionality while leveraging our robust access
                  control system.
                </p>
              </section>
            </div>
          </TabsContent>
          <TabsContent value="docs">
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-semibold">Integration Steps</h3>
                <ol className="list-decimal list-inside">
                  <li>Import the Talaria BetaProtocol contract</li>
                  <li>Extend your contract from BetaProtocol</li>
                  <li>Initialize with a whitelist address from app.talariaprotocol.xyz</li>
                  <li>Use the onlyWhitelisted modifier for restricted functions</li>
                </ol>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Key Components</h3>
                <ul className="list-disc list-inside">
                  <li>
                    <code>BetaProtocol</code>: Base contract to extend from
                  </li>
                  <li>
                    <code>onlyWhitelisted</code>: Modifier for access control
                  </li>
                  <li>
                    <code>_whitelist</code>: Address of your Talaria whitelist instance
                  </li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Example Usage</h3>
                <pre className="bg-gray-100 p-2 rounded">
                  <code>{`
import {BetaProtocol} from "./BetaProtocol.sol";

contract YourProtocol is BetaProtocol {
  constructor(address _whitelist) BetaProtocol(_whitelist) {}

  function test() public view onlyWhitelisted {
    // Your logic here
  }
}
                  `}</code>
                </pre>
              </section>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default Landing;
