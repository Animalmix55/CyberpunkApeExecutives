pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockNFT is ERC721 {
    constructor() ERC721("CyberpunkApesV2", "CA2") {}
    
    /**
     * Exposed for testing
     */
    function mint(address recipient, uint256 tokenId) external {
        _mint(recipient, tokenId);
    }
}