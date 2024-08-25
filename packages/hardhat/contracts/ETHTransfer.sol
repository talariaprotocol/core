// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CommitProtocol.sol";

contract ETHGiftCards is CommitProtocol {

  mapping(bytes32 => uint256) public giftCardValues;

  constructor(
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight
  ) CommitProtocol(_verifier, _hasher, _merkleTreeHeight) {}

  function createGiftCard(bytes32 _commitment, address[] calldata _validationModules) public payable {
    super.setCode(_commitment, _validationModules);

    require(msg.value > 0, "value should be greater than 0");

    giftCardValues[_commitment] = msg.value;
  }

  function consumeGiftCard(
  bytes32 _commitment,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _to,
    bytes[] calldata _validationsArgs
  ) public {
    super.consumeCode(_commitment,_proof, _root, _nullifierHash, _to, _validationsArgs);

    uint256 value = giftCardValues[_commitment];
  giftCardValues[_commitment] = 0;

    (bool success, ) = _to.call{ value: value }("");
    require(success, "payment to _to did not go thru");
  }
}