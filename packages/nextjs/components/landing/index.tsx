import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";

const Landing = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Protocol Information</CardTitle>
        <CardDescription>Learn about the protocol and how to implement it</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">About the Protocol</TabsTrigger>
            <TabsTrigger value="docs">Quick Implementation Docs</TabsTrigger>
          </TabsList>
          <TabsContent value="about">
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-semibold">What is our Protocol?</h3>
                <p>
                  Our protocol is a decentralized solution for managing whitelists and access control in blockchain
                  applications.
                </p>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Key Features</h3>
                <ul className="list-disc list-inside">
                  <li>Decentralized whitelist management</li>
                  <li>Flexible access control</li>
                  <li>Easy integration with existing smart contracts</li>
                  <li>Gas-efficient operations</li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold">How it Works</h3>
                <p>
                  The protocol uses smart contracts to maintain whitelists and verify access rights. Project owners can
                  easily manage their whitelists, while users can prove their access without revealing sensitive
                  information.
                </p>
              </section>
            </div>
          </TabsContent>
          <TabsContent value="docs">
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-semibold">Quick Start Guide</h3>
                <ol className="list-decimal list-inside">
                  <li>
                    Install the SDK: <code>npm install @protocol/sdk</code>
                  </li>
                  <li>
                    Import the main contract: <code>import {`WhitelistManager`} from '@protocol/sdk';</code>
                  </li>
                  <li>Initialize the contract with your project's address</li>
                  <li>Use the provided methods to manage your whitelist and check access</li>
                </ol>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Key Functions</h3>
                <ul className="list-disc list-inside">
                  <li>
                    <code>addToWhitelist(address)</code>: Add an address to the whitelist
                  </li>
                  <li>
                    <code>removeFromWhitelist(address)</code>: Remove an address from the whitelist
                  </li>
                  <li>
                    <code>isWhitelisted(address)</code>: Check if an address is whitelisted
                  </li>
                  <li>
                    <code>getWhitelistCount()</code>: Get the total number of whitelisted addresses
                  </li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Example Usage</h3>
                <pre className="bg-gray-100 p-2 rounded">
                  <code>{`
const whitelistManager = new WhitelistManager(projectAddress);
await whitelistManager.addToWhitelist(userAddress);
const isWhitelisted = await whitelistManager.isWhitelisted(userAddress);
                  `}</code>
                </pre>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Landing;
