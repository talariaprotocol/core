// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ERC1155Transfer.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract MatchTicketAirdropper is ERC1155Transfer, IERC1155Receiver {
    // Map for consumed MatchTickets per campaign
    mapping(bytes32 => uint256) public consumed;
    // Map for limit amount of MatchTickets per campaign
    mapping(bytes32 => uint256) public limits;

    event Success(bool success);

    constructor(
        IVerifier _verifier,
        IHasher _hasher,
        uint32 _merkleTreeHeight,
        IERC1155 _token
    ) ERC1155Transfer(_verifier, _hasher, _merkleTreeHeight, _token) {}

    // Implement the onERC1155Received function
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function createMatchTicketAirdrop(
        bytes32 _commitment,
        address[] calldata _validationModules,
        uint256 _id,
        uint256 _value,
        uint256 limit
    ) public payable {
        limits[_commitment] = limit;

        createTransfer(_commitment, _validationModules, _id, _value);
    }

    function consumeMatchTicketAirdrop(
        bytes32 _commitment,
        bytes calldata _proof,
        bytes32 _root,
        bytes32 _nullifierHash,
        address payable _to,
        bytes[] calldata _validationsArgs
    ) public {
        require(consumed[_commitment] < limits[_commitment], "MatchTicketAirdropper: Limit reached");

        consumed[_commitment] += 1;
        consumeTransfer(_commitment, _proof, _root, _nullifierHash, _to, _validationsArgs);

        emit Success(true);
    }

    function bulkCreateMatchTicketAirdrop(
        bytes32[] calldata _commitments,
        address[][] calldata _validationModules,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        uint256[] calldata _limits
    ) external payable {
        require(_commitments.length == _ids.length, "commitments and ids length mismatch");
        require(_commitments.length == _limits.length, "commitments and limits length mismatch");
        require(_commitments.length == _validationModules.length, "commitments and validationModules length mismatch");

        for (uint256 i = 0; i < _commitments.length; i++) {
            createMatchTicketAirdrop(_commitments[i], _validationModules[i], _ids[i], _values[i], _limits[i]);
        }
    }

    function bulkConsumeMatchTicketAirdrop(
        bytes32[] calldata _commitments,
        bytes[] calldata _proofs,
        bytes32[] calldata _roots,
        bytes32[] calldata _nullifierHashes,
        address payable[] calldata _tos,
        bytes[] calldata _validationsArgs
    ) external {
        require(_commitments.length == _proofs.length, "commitments and proofs length mismatch");
        require(_commitments.length == _roots.length, "commitments and roots length mismatch");
        require(_commitments.length == _nullifierHashes.length, "commitments and nullifierHashes length mismatch");
        require(_commitments.length == _tos.length, "commitments and tos length mismatch");
        require(_commitments.length == _validationsArgs.length, "commitments and validationsArgs length mismatch");

        for (uint256 i = 0; i < _commitments.length; i++) {
            consumeMatchTicketAirdrop(_commitments[i], _proofs[i], _roots[i], _nullifierHashes[i], _tos[i], _validationsArgs);
        }
    }

    function supportsInterface(bytes4 interfaceId) external view override returns (bool) {
      return interfaceId == type(IERC1155Receiver).interfaceId;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}