// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library VerifySig {
    function getMessageHash(bytes memory _msg) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_msg));
    }

    function getEthHashedMessage(bytes32 _msg)
        public
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _msg)
            );
    }

    function verify(
        address _signer,
        bytes memory _message,
        bytes memory signature
    ) public pure returns (bool success) {
        bytes32  _hashMessage = getMessageHash(_message);
        bytes32 _ethHashMessage = getEthHashedMessage(_hashMessage);

        return recover(_ethHashMessage, signature) == _signer;
    }

    function recover(bytes32 _ethHashMessage , bytes memory _sig) public pure returns(address){
        (bytes32 r , bytes32 s , uint8 v) = _split(_sig);
        return ecrecover(_ethHashMessage, v, r, s);
    }

    function _split(bytes memory _sig) private pure returns(bytes32 r ,bytes32 s , uint8 v) {
        require(_sig.length==65,"Signature is not valid");
        assembly{
            r :=mload(add(_sig,32))
            s := mload(add(_sig,64))
            v :=byte(0,mload(add(_sig,96)))
        }
    }
}