import React from "react";
import Collapsible from "../ui/collapsible";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";

const Landing = () => (
  <Collapsible
    title="Quick Integration Guide"
    children={
      <div className="space-y-4">
        <section>
          <h3 className="text-lg font-semibold">1. Whitelist Manager</h3>
          <p>Create the whitelist security layer</p>
          <pre className="bg-gray-100 p-2 rounded text-xs sm:text-sm overflow-x-auto max-w-full whitespace-pre-wrap break-normal">
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
          <pre className="bg-gray-100 p-2 rounded text-xs sm:text-sm overflow-x-auto max-w-full whitespace-pre-wrap break-normal">
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
          <pre className="bg-gray-100 p-2 rounded text-xs sm:text-sm overflow-x-auto max-w-full whitespace-pre-wrap break-normal">
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
    }
  />
);

export default Landing;
