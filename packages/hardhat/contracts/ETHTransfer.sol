// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TalariaProtocol.sol";

contract ETHTransfer is TalariaProtocol {

  mapping(bytes32 => uint256) public transferValues;

  constructor(
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight
  ) TalariaProtocol(_verifier, _hasher, _merkleTreeHeight) {}

  function createTransfer(bytes32 _commitment, address[] calldata _validationModules) public payable {
    super.setCode(_commitment, _validationModules);

    require(msg.value > 0, "value should be greater than 0");

    transferValues[_commitment] = msg.value;
  }

  function consumeTransfer(
    bytes32 _commitment,
    bytes memory _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _to,
    bytes[] memory _validationsArgs,
    bool transfer
  ) public {
    consumeCode(_commitment,_proof, _root, _nullifierHash, _to, _validationsArgs);

    uint256 value = transferValues[_commitment];
    transferValues[_commitment] = 0;

    if (transfer) {
      (bool success, ) = _to.call{ value: value }("");
      require(success, "payment to _to did not go thru");
    }
  }
}