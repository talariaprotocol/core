// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IValidationModule {
  function validate(bytes calldata arg) external returns (bool);
}