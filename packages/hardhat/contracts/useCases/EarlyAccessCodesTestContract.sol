// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./EarlyAccessCodes.sol";

contract EarlyAccessCodesTestContract {
  EarlyAccessCodes public earlyAccessCodes;
  constructor(EarlyAccessCodes _earlyAccessCodes) {
    earlyAccessCodes = _earlyAccessCodes;
  }

  event Success(bool success);

  function testFunction(
    bytes calldata _proof,
    bytes32 _root, //need?
    bytes32 _nullifierHash
  ) external {
    earlyAccessCodes.consumeEarlyAccessCode(_proof, _root, _nullifierHash, payable(msg.sender));
  
    emit Success(true);
  }
    
}