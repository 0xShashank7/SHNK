//SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {Shank} from "../src/SHNK.sol";

contract SHNKTest is Test {
    Shank public shank;

    address public admin = address(0x111);
    address public pauser = address(0x222);
    address public minter = address(0x333);
    address public user1 = address(0x444);

    function setUp() public {
        // Deploy contract with admin as the initial authority
        shank = new Shank(admin, admin, pauser, minter);
    }

    // Test1
    function test_InitialState() public view {
        assertEq(shank.name(), "Shank");
        assertEq(shank.symbol(), "SHNK");
        assertEq(shank.decimals(), 18);

        uint256 expectedInitialSupply = 69 * 10 ** shank.decimals();
        assertEq(shank.totalSupply(), expectedInitialSupply);
        assertEq(shank.balanceOf(admin), expectedInitialSupply);
    }

    // Test pausing functionality with proper role-based access control
    function test_PauseUnpause() public {
        // Test that admin has DEFAULT_ADMIN_ROLE, shows message if false
        assertTrue(shank.hasRole(shank.DEFAULT_ADMIN_ROLE(), admin), "Admin should have DEFAULT_ADMIN_ROLE");
        // Test that pauser has PAUSER_ROLE, shows message if false
        assertTrue(shank.hasRole(shank.PAUSER_ROLE(), pauser), "Pauser should have PAUSER_ROLE");
        // Test that minter has MINTER_ROLE, shows message if false
        assertTrue(shank.hasRole(shank.MINTER_ROLE(), minter), "Minter should have MINTER_ROLE");
        // Test that admin has PAUSER_ROLE, shows message if false
        assertTrue(shank.hasRole(shank.PAUSER_ROLE(), admin), "Admin should also have PAUSER_ROLE ");

        // pauser can pause
        vm.prank(pauser);
        shank.pause();
        assertTrue(shank.paused(), "pauser should pause Contract");

        vm.prank(pauser);
        shank.unpause();
        assertFalse(shank.paused(), "pauser should unpause Contract");

        // admin can pause
        vm.prank(admin);
        shank.pause();
        assertTrue(shank.paused(), "admin should pause Contract");

        vm.prank(admin);
        shank.unpause();
        assertFalse(shank.paused(), "admin should unpause Contract");

        // minter can't pause
        vm.prank(minter);
        vm.expectRevert();
        shank.pause();

        vm.prank(minter);
        vm.expectRevert();
        shank.unpause();

        // user1 can't pause
        vm.prank(user1);
        vm.expectRevert();
        shank.pause();

        vm.prank(user1);
        vm.expectRevert();
        shank.unpause();
    }

    function test_Mint() public {
        // only minter can mint
        vm.prank(minter);
        shank.mint(user1, 10 * 10 ** 18);
        assertEq(shank.balanceOf(user1), 10 * 10 ** 18);

        // user1 can't mint
        vm.prank(user1);
        vm.expectRevert();
        shank.mint(user1, 10 * 10 ** 18);

        // minter can't mint if admin paused
        vm.prank(admin);
        shank.pause();
        vm.prank(minter);
        vm.expectRevert();
        shank.mint(user1, 10 * 10 ** 18);

        // minting currently is not the initial supplied one because it just increased the balance of the user above
        vm.prank(minter);
        assertFalse(shank.totalSupply() == 69 * 10 ** 18);

        // current minted tokens = 69 + 10 == 79
        vm.prank(minter);
        assertEq(shank.totalSupply(), 69 * 10 ** 18 + 10 * 10 ** 18);

        // minting to address zero should revert
        vm.prank(minter);
        vm.expectRevert();
        shank.mint(address(0), 10 * 10 ** 18);
    }

    function test_Burn() public {
        uint256 amountToMint = 10 * 10 ** 18;
        vm.prank(minter);
        shank.mint(minter, amountToMint);

        // amount to burn
        uint256 amountToBurn = 5 * 10 ** 18;
        // minter can burn
        vm.prank(minter);
        shank.burn(minter, amountToBurn);
        assertEq(shank.balanceOf(minter), amountToMint - amountToBurn);

        // minter can't burn if admin paused
        vm.prank(admin);
        shank.pause();
        vm.prank(minter);
        vm.expectRevert();
        shank.burn(minter, amountToBurn);

        // user1 can't burn
        vm.prank(user1);
        vm.expectRevert();
        shank.burn(user1, 10 * 10 ** 18);

        // admin cant burn
        vm.prank(admin);
        vm.expectRevert();
        shank.burn(admin, 10 * 10 ** 18);

        // pauser cant burn
        vm.prank(pauser);
        vm.expectRevert();
        shank.burn(pauser, 10 * 10 ** 18);
    }

    function test_Transfer() public {
        uint256 amount = 20 * 10 ** shank.decimals();
        uint256 initialBalance = shank.balanceOf(admin);

        vm.prank(admin);
        shank.transfer(user1, amount);

        assertEq(shank.balanceOf(user1), amount, "User1 should receive tokens");
        assertEq(shank.balanceOf(admin), initialBalance - amount, "Admin should send tokens");

        // admin can't transfer if paused
        vm.prank(admin);
        shank.pause();
        vm.expectRevert();
        shank.transfer(user1, amount);

        // user1 can't transfer
        vm.prank(user1);
        vm.expectRevert();
        shank.transfer(user1, amount);
    }
}
