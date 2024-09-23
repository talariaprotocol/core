// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Whitelist} from "./Whitelist.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

abstract contract BetaProtocol is Ownable {
  
  /*
  * @dev The whitelist contract instance
  */
  Whitelist public whitelist;
  
  /*
  * @dev Whether beta access is enabled
  */
  bool public betaAccessEnabled;

  error UserNotWhitelistedAndBetaAccessIsEnabled();

  /*
  * @dev Modifier to check if the user is whitelisted
  */
  modifier onlyWhitelisted() {
    if (betaAccessEnabled && !whitelist.usersWhitelisted(msg.sender)) {
      revert UserNotWhitelistedAndBetaAccessIsEnabled();
    }
    _;
  }

  constructor(address _whitelist) Ownable(msg.sender) {
    whitelist = Whitelist(_whitelist);
    betaAccessEnabled = false; // Start disabled
  }

  /*
  * @dev Set the beta access enabled flag
  */
  function setBetaAccessEnabled(bool _enabled) public onlyOwner {
    betaAccessEnabled = _enabled;
  }
}