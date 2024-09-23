// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../TalariaProtocol.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelist is Ownable {
  TalariaProtocol talaria;

  mapping(address => bool) public usersWhitelisted;

  constructor(
    address _talaria
  ) Ownable(msg.sender) {
    talaria = TalariaProtocol(_talaria);
  }

  function createEarlyAccessCode(bytes32 _commitment, address[] calldata _validationModules) public payable {
    talaria.setCode(_commitment, _validationModules);
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
    talaria.consumeCode(_commitment,_proof, _root, _nullifierHash, _to, _validationsArgs);

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

  function isWhitelisted(address _user) public view returns (bool) {
    return usersWhitelisted[_user];
  }

  function addUserToWhitelist(address _user) public onlyOwner {
    usersWhitelisted[_user] = true;
  }

  function removeUserFromWhitelist(address _user) public onlyOwner {
    usersWhitelisted[_user] = false;
  }
}