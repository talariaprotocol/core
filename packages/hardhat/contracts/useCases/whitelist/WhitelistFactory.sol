// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TalariaFactory} from "../TalariaFactory.sol";
import {Whitelist} from "./Whitelist.sol";
import {TalariaProtocol} from "../../TalariaProtocol.sol";

contract WhitelistFactory {
  TalariaFactory talariaFactory;

  constructor(address _talariaFactory) {
    talariaFactory = TalariaFactory(_talariaFactory);
  }

  function create()  external returns (address) {
    TalariaProtocol talaria = talariaFactory.createTalariaInstance();
    Whitelist whitelist = new Whitelist(address(talaria));
    return address(whitelist);
  }
}