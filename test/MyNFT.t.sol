// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyNFT.sol";

contract MyNFTTest is Test {
    MyNFT nft;

    receive() external payable {}

    function setUp() public {
        nft = new MyNFT();
    }

    function testMint() public {
        address user = address(1);

        vm.prank(user);
        vm.deal(user, 1 ether);
        nft.mint{value: 0.001 ether}();

        assertEq(nft.ownerOf(0), user);
}

    function testMaxSupply() public {
        address user = address(1);

        for (uint256 i = 0; i < 100; i++) {
        vm.prank(user);
        vm.deal(user, 1 ether);
        nft.mint{value: 0.001 ether}();
    }

        vm.prank(user);
        vm.expectRevert();
        vm.deal(user, 1 ether);
        nft.mint{value: 0.001 ether}();
    }

    function testTokenIdIncrement() public {
        address user = address(1);

        vm.prank(user);
        vm.deal(user, 1 ether);
        nft.mint{value: 0.001 ether}();

        vm.prank(user);
        vm.deal(user, 1 ether);
        nft.mint{value: 0.001 ether}();

        assertEq(nft.nextTokenId(), 2);
    }

    function testMintWithPayment() public {
        address user = address(1);

    // Provide the user with enough ETH to mint
        vm.deal(user, 1 ether);

        vm.prank(user);
        nft.mint{value: 0.001 ether}();

        assertEq(nft.ownerOf(0), user);
    }

    function testMintFailsWithoutEnoughETH() public {
        address user = address(1);

        vm.deal(user, 1 ether);
    
        vm.prank(user);
        vm.expectRevert("insufficient funds");
        nft.mint{value: 0.0001 ether}();
    }

    function testContractBalance() public {
        address user = address(1);

        vm.deal(user, 1 ether);

        vm.prank(user);
        nft.mint{value: 0.001 ether}();

        assertEq(address(nft).balance, 0.001 ether);
    }

    function testWithdraw() public {
        address user = address(1);

        vm.deal(user, 1 ether);

        vm.prank(user);
        nft.mint{value: 0.001 ether}();
        uint256 ownerBalanceBefore = address(this).balance;

        nft.withdraw();

        uint256 ownerBalanceAfter = address(this).balance;

        assertGt(ownerBalanceAfter, ownerBalanceBefore);
    }

    function testWithdrawFailsIfNotOwner() public {
        address user = address(1);

        vm.prank(user);
        vm.expectRevert();
        vm.deal(user, 1 ether);
        nft.withdraw();
        }

    function testTokenURI() public {
        address user = address(1);

        vm.deal(user, 1 ether);
  
        vm.prank(user);
        nft.mint{value: 0.001 ether}();

        string memory expectedURI = "ipfs://bafybeicyoymsxnnc6p4nwn6hv445lzqno3bt4gx5wqqrnyponc2f7bvxju/0.json";

        assertEq(nft.tokenURI(0), expectedURI);
    }

    function testTokenURINonExistentToken() public {
         vm.expectRevert("token does not exist");

        nft.tokenURI(999);
    }
}