// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../modules/IValidationModule.sol";


struct Input {
  address signal;
  uint256 root;
  uint256 nullifierHash;
  uint256[8] proof;
}

struct Proof {
    uint256 root;
    uint256 groupId;
    uint256 signalHash;
    uint256 nullifierHash;
    uint256 externalNullifierHash;
    uint256[8] proof;
  }


interface WorldcoinVerifier {
  
  function verifyProof(
    uint256 root,
    uint256 groupId,
    uint256 signalHash,
    uint256 nullifierHash,
    uint256 externalNullifierHash,
    uint256[8] calldata proof
  ) external returns (bool);
}

contract WorldcoinValidatorModule is IValidationModule {

  address public worldcoinVerifier;

  string _appId;
  string _action;

  constructor(address _verifier) {
    worldcoinVerifier = _verifier;
    
    _appId = "app_staging_671675a8edd5130f3a7b0d2f9bc7b11c";
    _action = "commit2";
  }
  

function hashToField(bytes memory value) internal pure returns (uint256) {
  return uint256(keccak256(abi.encodePacked(value))) >> 8;
}

  function validate(bytes calldata arg) external override returns (bool) {
    // Decode args in Input struct
    Input memory input = abi.decode(arg, (Input));

    // Create Proof struct
    Proof memory proof = Proof({
      root: input.root,
      groupId: 1,
      signalHash: hashToField(abi.encodePacked(input.signal)),
      nullifierHash: input.nullifierHash,
      externalNullifierHash: hashToField(abi.encodePacked(hashToField(abi.encodePacked(_appId)), _action)),
      proof: input.proof
    }); 
  
    require(WorldcoinVerifier(worldcoinVerifier).verifyProof(
      proof.root,
      proof.groupId,
      proof.signalHash,
      proof.nullifierHash,
      proof.externalNullifierHash,
      proof.proof
    ), "Worldcoin Verification Failed");
    
    return true;
  }
}