// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./CyberpunkApeExecutives.sol";

contract Reenterer is IERC721Receiver {
    uint256 mintPrice;
    constructor(uint256 price) {
        mintPrice = price;
    }

    function proxyMint(uint16 amount, address contractAddress) external payable {
         CyberpunkApeExecutives(payable(contractAddress)).mint{ value: msg.value }(amount);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        require(from != address(this));
        require(tokenId != 0);
        require(data.length >= 0);

        // try to reenter
        CyberpunkApeExecutives(payable(operator)).mint{ value: mintPrice }(1);

        return IERC721Receiver.onERC721Received.selector;
    }
}