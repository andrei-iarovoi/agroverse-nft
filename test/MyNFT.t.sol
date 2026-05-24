// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyNFT.sol";

contract MyNFTTest is Test {
    MyNFT nft;

    function setUp() public {
        nft = new MyNFT();
    }

    function testMint() public {
    address user = address(1);

    vm.prank(user);
    nft.mint();

    assertEq(nft.ownerOf(0), user);
}

    function testMaxSupply() public {
    address user = address(1);

    for (uint256 i = 0; i < 100; i++) {
        vm.prank(user);
        nft.mint();
    }

    vm.prank(user);
    vm.expectRevert();
    nft.mint();
    }

    function testTokenIdIncrement() public {
    address user = address(1);

    vm.prank(user);
    nft.mint();

    vm.prank(user);
    nft.mint();

    assertEq(nft.nextTokenId(), 2);
    }
}