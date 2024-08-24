// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ERC721Transfer.sol";

contract POAPAirdropper is ERC721Transfer {

// Map for consumed poaps per campaign
  mapping(bytes32 => uint256) public consumed;
// Map for limit amount of poaps per campaign
  mapping(bytes32 => uint256) public limits;

  constructor (
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight,
    IERC721 _token
  ) ERC721Transfer(_verifier, _hasher, _merkleTreeHeight, _token) {  
  }

  function createPOAPAirdropper(bytes32 _commitment, address[] calldata _validationModules, uint256 _id, uint256 limit) external payable nonReentrant {
    limits[_commitment] = limit;
    
    createTransfer(
      _commitment,
      _validationModules,
      _id
    );
  }

  function consumePOAPAirdropper(
    bytes32 _commitment,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _to,
    bytes[] calldata _validationsArgs
  ) external nonReentrant {
    require(consumed[_commitment] < limits[_commitment], "POAPAirdropper: Limit reached");

    consumed[_commitment] += 1;
    consumeTransfer(
      _commitment,
      _proof,
      _root,
      _nullifierHash,
      _to,
      _validationsArgs
    );
  }
}