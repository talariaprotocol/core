// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../TalariaProtocol.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelist is Ownable, TalariaProtocol{

  mapping(address => bool) public usersWhitelisted;

  event UserAddedToWhitelist(address indexed user, uint256 timestamp);
  event UserRemovedFromWhitelist(address indexed user, uint256 timestamp);

  constructor(
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight,
    address _owner
  ) TalariaProtocol(_verifier, _hasher, _merkleTreeHeight
  ) Ownable(_owner) {
  }

  function createEarlyAccessCode(bytes32 _commitment, address[] calldata _validationModules) public onlyOwner payable {
    setCode(_commitment, _validationModules);
  }

  function consumeEarlyAccessCode(
    bytes32 _commitment,
    bytes calldata _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _to,
    bytes[] calldata _validationsArgs,
    address userToWhitelist
  ) public {
    require(!usersWhitelisted[userToWhitelist], "User already whitelisted");

    consumeCode(_commitment,_proof, _root, _nullifierHash, _to, _validationsArgs);

    usersWhitelisted[userToWhitelist] = true;
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
    bytes[] calldata _validationsArgs,
    address[] calldata _usersToWhitelist
  ) public {
    for (uint256 i = 0; i < _commitments.length; i++) {
      consumeEarlyAccessCode(_commitments[i], _proofs[i], _roots[i], _nullifierHashes[i], _tos[i], _validationsArgs, _usersToWhitelist[i]);
    }
  }

  function isWhitelisted(address _user) external view returns (bool) {
    return usersWhitelisted[_user];
  }

  function addUserToWhitelist(address _user) public onlyOwner {
    require(!usersWhitelisted[_user], "User already whitelisted");

    usersWhitelisted[_user] = true;

    emit UserAddedToWhitelist(_user, block.timestamp);
  }

  function removeUserFromWhitelist(address _user) public onlyOwner {
    require(usersWhitelisted[_user], "User not whitelisted");

    usersWhitelisted[_user] = false;
    
    emit UserRemovedFromWhitelist(_user, block.timestamp);
  }
}