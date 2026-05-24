// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    uint256 public nextTokenId;
    uint256 public constant MAX_SUPPLY = 100;

    constructor() ERC721("MyNFT", "MNFT") {}

    function mint() external {
        require(nextTokenId < MAX_SUPPLY, "max supply reached");
        _safeMint(msg.sender, nextTokenId);
        nextTokenId++;
    }
}