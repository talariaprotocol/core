// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TalariaFactory} from "../TalariaFactory.sol";
import {Whitelist} from "./Whitelist.sol";
import "../../TalariaProtocol.sol";

contract WhitelistFactory is TalariaFactory {

    event WhitelistCreated (address indexed whitelist);

    constructor (
        IVerifier _verifier,
        IHasher _hasher,
        uint32 _merkleTreeHeight
    ) 
        TalariaFactory(_verifier, _hasher, _merkleTreeHeight)
    {}

    function create() override external returns (address) {
        Whitelist w = new Whitelist(
            defaultVerifier,
            defaultHasher,
            defaultMerkleTreeHeight,
            msg.sender
        );

        emit WhitelistCreated(address(w));

        return address(w);
    }
}