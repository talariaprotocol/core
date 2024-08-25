// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ERC20Transfer.sol";

contract GiftCards is ERC20Transfer {

  // Mapping for gift card's metadata
  mapping(bytes32 => string) public metadata;

  event Success(bool success);

  constructor (
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight,
    IERC20 _token
  ) ERC20Transfer(_verifier, _hasher, _merkleTreeHeight, _token) {  }

  function createGiftCard(bytes32 _commitment, address[] calldata _validationModules, uint256 _value, string memory _metadata) public payable  {
    metadata[_commitment] = _metadata;

    super.createTransfer(
      _commitment,
      _value,
      _validationModules
    );
  }

  function consumeGiftCard(
    bytes32 _commitment,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _to,
    bytes[] calldata _validationsArgs
  ) public  {
    super.consumeTransfer(
      _commitment,
      _proof,
      _root,
      _nullifierHash,
      _to,
      _validationsArgs
    );

        emit Success(true);

  }

  function bulkCreateGiftCard(bytes32[] calldata _commitments, address[][] calldata _validationModules, uint256[] calldata _values, string[] calldata _metadata) external payable  {
    require(_commitments.length == _values.length, "commitments and values length mismatch");
    require(_commitments.length == _metadata.length, "commitments and metadata length mismatch");
    require(_commitments.length == _validationModules.length, "commitments and validationModules length mismatch");

    for (uint256 i = 0; i < _commitments.length; i++) {
      createGiftCard(_commitments[i], _validationModules[i], _values[i], _metadata[i]);
    }
  }

  function bulkConsumeGifCard(
    bytes32[] calldata _commitments,
    bytes[] calldata _proofs,
    bytes32[] calldata _roots,
    bytes32[] calldata _nullifierHashes,
    address payable[] calldata _tos,
    bytes[] calldata _validationsArgs
  ) external  {
    require(_commitments.length == _proofs.length, "commitments and proofs length mismatch");
    require(_commitments.length == _roots.length, "commitments and roots length mismatch");
    require(_commitments.length == _nullifierHashes.length, "commitments and nullifierHashes length mismatch");
    require(_commitments.length == _tos.length, "commitments and tos length mismatch");
    require(_commitments.length == _validationsArgs.length, "commitments and validationsArgs length mismatch");

    for (uint256 i = 0; i < _commitments.length; i++) {
      consumeGiftCard(
        _commitments[i],
        _proofs[i],
        _roots[i],
        _nullifierHashes[i],
        _tos[i],
        _validationsArgs
      );
    }
  }
}