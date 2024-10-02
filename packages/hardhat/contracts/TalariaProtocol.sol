// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./helpers/MerkleTreeWithHistory.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./modules/IValidationModule.sol";

interface IVerifier {
  function verifyProof(bytes memory _proof, uint256[6] memory _input) external returns (bool);
}

contract TalariaProtocol is MerkleTreeWithHistory, ReentrancyGuard {
  IVerifier public immutable verifier;
 
  mapping(bytes32 => bool) public nullifierHashes;
  // we store all commitments just to prevent accidental creations with the same commitment
  mapping(bytes32 => bool) public commitments;

  // commitments to validation modules 
  mapping(bytes32 => address[]) public validationModules;

  event NewCode(bytes32 indexed commitment, uint32 leafIndex, uint256 timestamp);
  event ConsumeCode(address to, bytes32 nullifierHash, uint256 timestamp);

  /**
    @dev The constructor
    @param _verifier the address of SNARK verifier for this contract
    @param _hasher the address of MiMC hash contract
    @param _merkleTreeHeight the height of codes' Merkle Tree
  */
  constructor(
    IVerifier _verifier,
    IHasher _hasher,
    uint32 _merkleTreeHeight
  ) MerkleTreeWithHistory(_merkleTreeHeight, _hasher) {
    verifier = _verifier;
  }

  /**
    @dev Set new code.
    @param _commitment the note commitment, which is PedersenHash(nullifier + secret)
  */
  function setCode(bytes32 _commitment, address[] calldata _validationModules) public virtual payable nonReentrant {
    require(!commitments[_commitment], "The commitment has been submitted");

    uint32 insertedIndex = _insert(_commitment);
    commitments[_commitment] = true;

    for (uint256 i = 0; i < _validationModules.length; i++) {
      validationModules[_commitment].push(_validationModules[i]);
    }

    emit NewCode(_commitment, insertedIndex, block.timestamp);
  }


  /**
    @dev Consume a code from the contract. `proof` is a zkSNARK proof data, and input is an array of circuit public inputs
    `input` array consists of:
      - merkle root of all codes in the contract
      - hash of unique codes nullifier to prevent double spends
      - the recipient of funds
      - optional fee that goes to the transaction sender (usually a relay)
  */
  function consumeCode(
    bytes32 _commitment,
    bytes memory _proof,
    bytes32 _root,
    bytes32 _nullifierHash,
    address payable _recipient,
    bytes[] memory _validationsArgs
  ) public virtual payable nonReentrant {
    require(!nullifierHashes[_nullifierHash], "The note has been already spent");
    require(isKnownRoot(_root), "Cannot find your merkle root"); // Make sure to use a recent one
        
    require(
      verifier.verifyProof(
        _proof,
        [uint256(_root), uint256(_nullifierHash), uint256(uint160(address(_recipient))),0 ,0, 0]
      ),
      "Invalid withdraw proof"
    );

    for (uint256 i = 0; i < validationModules[_commitment].length; i++) {
      IValidationModule(validationModules[_commitment][i]).validate(_validationsArgs[i]);
    }

    nullifierHashes[_nullifierHash] = true;

    emit ConsumeCode(_recipient, _nullifierHash, block.timestamp);
  }

  /** @dev whether a note is already spent */
  function isSpent(bytes32 _nullifierHash) public view returns (bool) {
    return nullifierHashes[_nullifierHash];
  }

  /** @dev whether an array of notes is already spent */
  function isSpentArray(bytes32[] calldata _nullifierHashes) external view returns (bool[] memory spent) {
    spent = new bool[](_nullifierHashes.length);
    for (uint256 i = 0; i < _nullifierHashes.length; i++) {
      if (isSpent(_nullifierHashes[i])) {
        spent[i] = true;
      }
    }
  }
}
