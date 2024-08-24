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
    bytes32 _commitment,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    bytes[] calldata _validationsArgs
  ) external {
    earlyAccessCodes.consumeEarlyAccessCode(_commitment, _proof, _root, _nullifierHash, payable(msg.sender), _validationsArgs);
  
    emit Success(true);
  }
    
}