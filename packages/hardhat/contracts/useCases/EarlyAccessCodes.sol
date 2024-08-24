// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../CommitProtocol.sol";

contract EarlyAccessCodes is CommitProtocol {

  constructor(
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight
  ) CommitProtocol(_verifier, _hasher, _merkleTreeHeight) {}

  function createEarlyAccessCode(bytes32 _commitment, address[] calldata _validationModules) external payable {
    super.setCode(_commitment, _validationModules);
  }

  function consumeEarlyAccessCode(
    bytes32 _commitment,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _to,
    bytes[] calldata _validationsArgs
  ) external {
    super.consumeCode(_commitment,_proof, _root, _nullifierHash, _to, _validationsArgs);
  }
}