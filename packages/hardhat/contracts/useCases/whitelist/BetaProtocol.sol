// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IWhitelist {
  function isWhitelisted(address _user) external view returns (bool);
}

abstract contract BetaProtocol is Ownable {
  
  /*
  * @dev The whitelist contract instance
  */
  IWhitelist public whitelist;
  
  /*
  * @dev Whether beta access is enabled
  */
  bool public betaAccessEnabled;

  error UserNotWhitelistedAndBetaAccessIsEnabled();

  event BetaAccessEnabled();
  event BetaAccessDisabled();
  event WhitelistCodeUsed(address indexed user, uint256 timestamp);
  event AddressNotAllowed(address indexed user, uint256 timestamp);


  /*
  * @dev Modifier to check if the user is whitelisted
  */
  modifier onlyWhitelisted() {
    if (betaAccessEnabled && !whitelist.isWhitelisted(msg.sender)) {
      emit AddressNotAllowed(msg.sender, block.timestamp);

      revert UserNotWhitelistedAndBetaAccessIsEnabled();
    }

    emit WhitelistCodeUsed(msg.sender, block.timestamp);
    _;
  }

  constructor(address _whitelist) Ownable(msg.sender) {
    whitelist = IWhitelist(_whitelist);

    betaAccessEnabled = true; // Start disabled
  }

  /*
  * @dev Set the beta access enabled flag
  */
  function setBetaAccessEnabled(bool _enabled) public onlyOwner {
    betaAccessEnabled = _enabled;
  }
}