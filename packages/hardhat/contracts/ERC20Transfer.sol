// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CommitProtocol.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20Transfer is CommitProtocol {
  IERC20 public token;

  mapping(bytes32 => uint256) public TransferValues;

   constructor(
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight,
    IERC20 _token
  ) CommitProtocol(_verifier, _hasher, _merkleTreeHeight) {
    token = _token;
  }

  function createTransfer(bytes32 _commitment, uint256 _value) public payable nonReentrant {
    super.setCode(_commitment);

    token.transferFrom(msg.sender, address(this), _value);

    TransferValues[_commitment] = _value;
  }

  function consumeTransfer(
  bytes32 _commitment,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _to
  ) public nonReentrant {
    super.consumeCode(_proof, _root, _nullifierHash, _to);

    uint256 value = TransferValues[_commitment];

    token.transferFrom(address(this), _to, value);
  }

 
}