// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ERC20Transfer.sol";

contract GiftCards is ERC20Transfer {

  // Mapping for gift card's metadata
  mapping(bytes32 => string) public metadata;

  constructor (
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight,
    IERC20 _token
  ) ERC20Transfer(_verifier, _hasher, _merkleTreeHeight, _token) {  }

  function createGiftCard(bytes32 _commitment, address[] calldata _validationModules, uint256 _value, string memory _metadata) external payable nonReentrant {
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
  ) external nonReentrant {
    super.consumeTransfer(
      _commitment,
      _proof,
      _root,
      _nullifierHash,
      _to,
      _validationsArgs
    );
  }

}