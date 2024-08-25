// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CommitProtocol.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract ERC1155Transfer is CommitProtocol {
  IERC1155 public token;

  mapping(bytes32 => uint256) public TransferIds;
  mapping(bytes32 => uint256) public TransferAmounts;

   constructor(
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight,
    IERC1155 _token
  ) CommitProtocol(_verifier, _hasher, _merkleTreeHeight) {
    token = _token;
  }

  function createTransfer(bytes32 _commitment, address[] calldata _validationModules, uint256 _id, uint256 _amount) public payable {
    super.setCode(_commitment, _validationModules);

    token.safeTransferFrom(msg.sender, address(this), _id, _amount, "");

    TransferIds[_commitment] = _id;
    TransferAmounts[_commitment] = _amount;
  }

  function consumeTransfer(
  bytes32 _commitment,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _to,
    bytes[] calldata _validationsArgs
  ) public {
    super.consumeCode(_commitment, _proof, _root, _nullifierHash, _to, _validationsArgs);

    uint256 id = TransferIds[_commitment];
    uint256 amount = TransferAmounts[_commitment];

    token.safeTransferFrom(address(this), _to, id, amount, "");
  }
}