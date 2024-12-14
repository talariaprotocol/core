// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Verifier {
    function getEthHashedMessage(bytes memory message) public pure returns (bytes32) {
        // This replicates personal_sign behavior:
        // keccak256("\x19Ethereum Signed Message:\n" + length(message) + message)

        return keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n",
            _uintToDecimalString(message.length),
            message
        ));
    }

    function verify(
        address _signer,
        bytes memory _message,
        bytes memory signature
    ) public pure returns (bool success) {

        bytes32 ethHashMessage = getEthHashedMessage(_message);

        address signerFromSignature = recover(ethHashMessage, signature);

        return signerFromSignature == _signer;
    }

    function recover(bytes32 _ethHashMessage , bytes memory _sig) public pure returns(address){
        (bytes32 r , bytes32 s , uint8 v) = _split(_sig);
        return ecrecover(_ethHashMessage, v, r, s);
    }

    function _split(bytes memory _sig) private pure returns(bytes32 r ,bytes32 s , uint8 v) {
        require(_sig.length==65,"Signature is not valid");
        assembly {
            r := mload(add(_sig,32))
            s := mload(add(_sig,64))
            v := byte(0,mload(add(_sig,96)))
        }
    }

    function _uintToDecimalString(uint256 value) private pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
