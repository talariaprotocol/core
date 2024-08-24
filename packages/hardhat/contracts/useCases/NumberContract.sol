// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./EarlyAccessCodes.sol";

contract NumberContract {
  EarlyAccessCodes public earlyAccessCodes;

  constructor(EarlyAccessCodes _earlyAccessCodes) {
    earlyAccessCodes = _earlyAccessCodes;
  }

  event Success(bool success);

  uint256 public number;

  function setNumber (
    bytes32 _commitment,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    bytes[] calldata _validationsArgs,
    uint256 _number
  ) external {
    earlyAccessCodes.consumeEarlyAccessCode(_commitment, _proof, _root, _nullifierHash, payable(msg.sender), _validationsArgs);
  
    number = _number;

    emit Success(true);
  }
    
}