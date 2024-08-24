// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../modules/IValidationModule.sol";

interface ICircuitValidator {
  // Variables
  struct CircuitQuery {
    string circuitId;
    uint256 schema;
    uint256 slotIndex;
    uint256 operator;
    uint256[] value;
  }

  struct Params {
    uint256[] inputs;
    uint256[2] a;
    uint256[2][2] b;
    uint256[2] c;
  }

  /**
   * @dev verify
   */
  function verify(
    uint256[] memory inputs,
    uint256[2] memory a,
    uint256[2][2] memory b,
    uint256[2] memory c,
    CircuitQuery memory query
  ) external view returns (bool r);

  /**
   * @dev getCircuitId
   */
  function getCircuitId() external pure returns (string memory id);

  /**
   * @dev getChallengeInputIndex
   */
  function getChallengeInputIndex() external pure returns (uint256 index);

  /**
   * @dev getUserIdInputIndex
   */
  function getUserIdInputIndex() external pure returns (uint256 index);
}



contract PrivadoIDValidatorModule is IValidationModule {

  address public PrivadoIDValidator;
  ICircuitValidator.CircuitQuery public query;

  constructor(ICircuitValidator.CircuitQuery memory _query) {
    PrivadoIDValidator = 0x8c99F13dc5083b1E4c16f269735EaD4cFbc4970d; // Amoy Tesnet Address validator @todo: move to deploy script
    
    query = _query;
  }

  function validate(bytes calldata arg) external override returns (bool) {
    ICircuitValidator.Params memory params = abi.decode(arg, (ICircuitValidator.Params));

    require(ICircuitValidator(PrivadoIDValidator).verify(params.inputs, 
      params.a, 
      params.b, 
      params.c, 
      query
    ), "PrivadoID Verification Failed");
    
    return true;
  }
}