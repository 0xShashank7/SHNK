// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {Shank} from "../src/SHNK.sol";

contract SHNKScript is Script {
    function run() public returns (Shank) {
        // address that will manage all roles.
        address deployer = vm.addr(vm.envUint("PRIVATE_KEY"));
        address deployerAddress = deployer;

        vm.startBroadcast();

        // Deploy the contract
        Shank token = new Shank(
            deployerAddress,
            deployerAddress,
            deployerAddress,
            deployerAddress
        );

        //  Stop broadcast
        vm.stopBroadcast();

        //  deployed address
        console.log("SHNK deployed to:", address(token));

        return token;
    }
}
