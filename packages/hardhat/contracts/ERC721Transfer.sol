// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TalariaProtocol.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ERC721Transfer is TalariaProtocol {
  IERC721 public token;

  mapping(bytes32 => uint256) public TransferId;

   constructor(
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight,
    IERC721 _token
  ) TalariaProtocol(_verifier, _hasher, _merkleTreeHeight) {
    token = _token;
  }

  function createTransfer(bytes32 _commitment, address[] calldata _validationModules, uint256 _id) public payable {
    super.setCode(_commitment, _validationModules);

    token.safeTransferFrom(msg.sender, address(this), _id);

    TransferId[_commitment] = _id;
  }

  function consumeTransfer(
  bytes32 _commitment,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _to,
    bytes[] calldata _validationsArgs
  ) public {
    super.consumeCode(_commitment,_proof, _root, _nullifierHash, _to, _validationsArgs);

    uint256 id = TransferId[_commitment];

    token.safeTransferFrom(address(this), _to, id);
  }
 
}