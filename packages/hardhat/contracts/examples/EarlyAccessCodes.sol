// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../TalariaProtocol.sol";

contract EarlyAccessCodes is TalariaProtocol {

  constructor(
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight
  ) TalariaProtocol(_verifier, _hasher, _merkleTreeHeight) {}

  function createEarlyAccessCode(bytes32 _commitment, address[] calldata _validationModules) public payable {
    super.setCode(_commitment, _validationModules);
  }

  function consumeEarlyAccessCode(
    bytes32 _commitment,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _to,
    bytes[] calldata _validationsArgs
  ) public {
    super.consumeCode(_commitment,_proof, _root, _nullifierHash, _to, _validationsArgs);
  }

  function bulkCreateEarlyAccessCodes(bytes32[] calldata _commitments, address[][] calldata _validationModules) public payable {
    for (uint256 i = 0; i < _commitments.length; i++) {
      createEarlyAccessCode(_commitments[i], _validationModules[i]);
    }
  }

  function bulkConsumeEarlyAccessCodes(
    bytes32[] calldata _commitments,
    bytes[] calldata _proofs,
    bytes32[] calldata _roots,
    bytes32[] calldata _nullifierHashes,
    address payable[] calldata _tos,
    bytes[] calldata _validationsArgs
  ) public {
    for (uint256 i = 0; i < _commitments.length; i++) {
      consumeEarlyAccessCode(_commitments[i], _proofs[i], _roots[i], _nullifierHashes[i], _tos[i], _validationsArgs);
    }
  }
}