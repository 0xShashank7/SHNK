// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {Shank} from "../src/SHNK.sol";

contract SHNKScript is Script {
    function run() public returns (Shank) {
        address admin = 0x7f3B3db2b0A46Cec68D7AAc25f8534CfAf202c16;
        address pauser = 0x7f3B3db2b0A46Cec68D7AAc25f8534CfAf202c16;
        address minter = 0x651B6969397C36DeB2f949605D089Fc5AC67FCF6;
        address recipient = 0xBbe1AebD2d41F8492bb13539d81ff389B213ECf0;

        vm.startBroadcast();

        // Deploy the contract
        Shank token = new Shank(recipient, admin, pauser, minter);

        //  Stop broadcast
        vm.stopBroadcast();

        //  deployed address
        console.log("SHNK deployed to:", address(token));

        return token;
    }
}
