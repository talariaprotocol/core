// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {BetaProtocol} from "./BetaProtocol.sol";

// Disable console.log warning for testing purposes
// solhint-disable no-console
import {console} from "hardhat/console.sol";

/*
* @dev This is an example protocol that uses the Talaria beta access whitelist
*/
contract TestProtocol is BetaProtocol {

  /*
  * @dev Constructor
  * @param _whitelist The address of the whitelist contract instance, you can generate one at app.talariaprotocol.xyz
  */
  constructor(address _whitelist) BetaProtocol(_whitelist) {}

  /*
  * @dev Test function
  * @notice This function is only callable by whitelisted users
  */
  function test() public view onlyWhitelisted {
    console.log("TestProtocol: test() called by whitelisted user");
  }
}
