// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import {IHasher} from "../helpers/MerkleTreeWithHistory.sol";
import {TalariaProtocol, IVerifier} from "../../contracts/TalariaProtocol.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

abstract contract TalariaFactory is Ownable {
    IVerifier defaultVerifier;
    IHasher defaultHasher;
    uint32 defaultMerkleTreeHeight;
    
    constructor(
        IVerifier _verifier,
        IHasher _hasher,
        uint32 _merkleTreeHeight
    ) {
        defaultVerifier = _verifier;
        defaultHasher = _hasher;
        defaultMerkleTreeHeight = _merkleTreeHeight;
    }

    function changeDefaultVerifier(IVerifier _newVerifier) external onlyOwner {
        defaultVerifier = _newVerifier;
    }

    function changeDefaultHasher(IHasher _newHasher) external onlyOwner {
        defaultHasher = _newHasher;
    }   

    function changeDefaultMerkleTreeHeight(uint32 _newMerkleTreeHeight) external onlyOwner {
        defaultMerkleTreeHeight = _newMerkleTreeHeight;
    }

    function createTalariaInstance() public returns (TalariaProtocol) {
        return new TalariaProtocol(defaultVerifier, defaultHasher, defaultMerkleTreeHeight);
    }

    /*
    * @dev Creates a new Talaria instance and returns the address
    */
    function create() virtual external returns (address);       
}