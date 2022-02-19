// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CyberpunkApeLegends is ERC721A, Ownable, ReentrancyGuard {
    /**
     * The baseURI for tokens
     */
    string private baseURI = "";

    /**
     * The ERC20 token contract that will be used
     * to pay to mint the token.
     */
    IERC20 public paymentToken;

    /**
     * The cost of minting
     */
    uint256 public mintCost;

    /**
     * The maximum supply for the token.
     * Will never exceed this supply.
     * @dev is mutable
     */
    uint64 public maxSupply;

    /**
     * Deploys the contract and mints the first token to the deployer.
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(
        uint64 _initialSupply,
        address _paymentToken,
        uint256 _mintCost,
        string memory _baseUri
    ) ERC721A("Cyberpunk Ape Executives Legends", "CAEL") {
        require(_initialSupply >= 1, "Bad supply");
        require(_paymentToken != address(0), "Bad token");
        require(_mintCost > 0, "Bad cost");

        maxSupply = _initialSupply;
        paymentToken = IERC20(_paymentToken);
        mintCost = _mintCost;

        baseURI = _baseUri;

        mint(1);
    }

    // ------------------------------------------------ ADMINISTRATION LOGIC ------------------------------------------------

    /**
     * Sets the base URI for all immature tokens
     *
     * @dev be sure to terminate with a slash
     * @param uri - the target base uri (ex: 'https://google.com/')
     */
    function setBaseURI(string calldata uri) public onlyOwner {
        baseURI = uri;
    }

    function setMaxSupply(uint64 supply) public onlyOwner {
        require(supply > maxSupply, "Too small");

        maxSupply = supply;
    }

    /**
     * Sets the payment ERC20 token
     *
     * @param tokenAddress - the address of the payment token
     */
    function setPaymentToken(address tokenAddress) public onlyOwner {
        paymentToken = IERC20(tokenAddress);
    }

    /**
     * Sets the mint price
     *
     * @param _mintCost - the mint cost
     */
    function setMintPrice(uint256 _mintCost) external onlyOwner {
        mintCost = _mintCost;
    }

    // ------------------------------------------------ URI LOGIC -------------------------------------------------

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function _baseURI() internal override view virtual returns (string memory) {
        return baseURI;
    }

    // ------------------------------------------------ MINT LOGIC ------------------------------------------------

    /**
     * Mints the given quantity of tokens provided it is possible to.
     * transfers the required number of tokens from the user's wallet
     *
     * @notice This function allows minting for the set cost,
     * or free for the contract owner
     *
     * @param _quantity - the number of tokens to mint
     */
    function mint(uint64 _quantity) public nonReentrant {
        uint256 remaining = maxSupply - _currentIndex;

        require(remaining > 0, "Mint over");
        require(_quantity >= 1, "Bad quantity");
        require(_quantity <= remaining, "Not enough");
        bool isOwner = msg.sender == owner();

        if (!isOwner) {
            // transfers out token if not owner
            uint256 cost = _quantity * mintCost;
            IERC20(paymentToken).transferFrom(msg.sender, address(this), cost);
        }

        // DISTRIBUTE THE TOKENS
        _safeMint(msg.sender, _quantity);
    }

    // ------------------------------------------------ BURN LOGIC ------------------------------------------------

    /**
     * Burns the provided token id if you own it.
     * Reduces the supply by 1.
     *
     * @param tokenId - the ID of the token to be burned.
     */
    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");

        _burn(tokenId);
    }

    // ------------------------------------------------ BALANCE STUFFS ------------------------------------------------

    /**
     * Gets the balance of the contract in payment tokens.
     * @return the amount held by the contract.
     */
    function balance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }

    /**
     * Withdraws balance from the contract to the owner (sender).
     * @param amount - the amount to withdraw, much be <= contract balance.
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(this.balance() >= amount, "Not enough");

        paymentToken.transfer(msg.sender, amount);
    }

    /**
     * The receive function, does nothing
     */
    receive() external payable {
        // NOTHING TO SEE HERE
    }
}
