// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MyNFT - Simple NFT Minting Contract
/// @author andrei-iarovo
/// @notice Allows users to mint NFTs for a fixed price
contract MyNFT is ERC721, Ownable {
    /// @notice ID of the next token to be minted
    uint256 public nextTokenId;

    /// @notice Maximum number of NFTs that can be minted
    uint256 public constant MAX_SUPPLY = 100;

    /// @notice Price per NFT mint
    uint256 public mintPrice = 0.001 ether;

    constructor() ERC721("MyNFT", "MNFT") Ownable {}

    /// @notice Mint a new NFT by paying the mint price
    /// @dev Reverts if max supply reached or insufficient ETH sent
    function mint() external payable {
        require(nextTokenId < MAX_SUPPLY, "max supply reached");
        require(msg.value >= mintPrice, "insufficient funds");
        
        _safeMint(msg.sender, nextTokenId);
        nextTokenId++;
    }

    /// @notice Withdraw all ETH from the contract to the owner
    /// @dev Uses call to avoid gas limit issues with transfer
    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "withdraw failed");
    }
}