// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../modules/IValidationModule.sol";


interface WorldcoinVerifier {
  function verifyProof(
    bytes calldata args
  ) external returns (bool);
}

contract WorldcoinValidatorModule is IValidationModule {

  address public worldcoinVerifier;

  constructor() {
    worldcoinVerifier = 0x11cA3127182f7583EfC416a8771BD4d11Fae4334; // Sepolia Tesnet Address @todo: move to deploy script
  }
  


  function validate(bytes calldata arg) external override returns (bool) {
    require(WorldcoinVerifier(worldcoinVerifier).verifyProof(
      arg
    ), "Worldcoin Verification Failed");
    
    return true;
  }
}