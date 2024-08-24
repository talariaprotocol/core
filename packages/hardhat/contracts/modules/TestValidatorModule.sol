// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../modules/IValidationModule.sol";

contract TestValidatorModule is IValidationModule {

  function validate(bytes calldata arg) external override returns (bool) {
    return true;
  }
}