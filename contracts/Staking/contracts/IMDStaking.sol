// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "./interfaces/ICollegeCredit.sol";
import "./CollegeCredit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Interfaces/IStakingInterface.sol";

contract IMDStaking is IStakingInterface, Ownable, ReentrancyGuard {
    struct StakedToken {
        uint256 stakeTimestamp;
        address owner;
    }

    struct StakableTokenAttributes {
        uint16 minYield;
        uint16 maxYield;
        uint16 step;
        uint256 yieldPeriod;
        mapping(uint256 => StakedToken) stakedTokens;
        uint256[] stakedTokenIds;
    }

    /**
     * A mapping of modifiers to rewards for each staker's
     * address.
     */
    mapping(address => uint256) rewardModifier;

    /**
     * A mapping of token addresses to staking configurations.
     */
    mapping(address => StakableTokenAttributes) public stakableTokenAttributes;
    /**
     * An array of stakable ERC721 token addresses.
     */
    address[] stakableTokens;

    /**
     * The reward token (college credit) to be issued
     * to stakers.
     */
    ICollegeCredit public rewardToken;

    /**
     * The constructor for the staking contract, builds the initial
     * reward token and stakable token.
     * @param _token the first stakable token address.
     * @param _minYield the minimum yield for the stakable token.
     * @param _maxYield the maximum yield for the stakable token.
     * @param _step the amount yield increases per yield period.
     * @param _yieldPeriod the length (in seconds) of a yield period (the amount of period after which a yield is calculated)
     */
    constructor(
        address _token,
        uint16 _minYield,
        uint16 _maxYield,
        uint16 _step,
        uint256 _yieldPeriod
    ) {
        _addStakableToken(_token, _minYield, _maxYield, _step, _yieldPeriod);
        rewardToken = new CollegeCredit();
    }

    /**
     * Mints the reward token to an account.
     * @dev owner only
     * @param _recipient the recipient of the minted tokens.
     * @param _amount the amount of tokens to mint.
     */
    function mintRewardToken(address _recipient, uint256 _amount)
        external
        onlyOwner
    {
        rewardToken.mint(_recipient, _amount);
    }

    /**
     * Adds a new token that can be staked in the contract.
     * @param _token the first stakable token address.
     * @param _minYield the minimum yield for the stakable token.
     * @param _maxYield the maximum yield for the stakable token.
     * @param _step the amount yield increases per yield period.
     * @param _yieldPeriod the length (in seconds) of a yield period (the amount of period after which a yield is calculated)
     */
    function addStakableToken(
        address _token,
        uint16 _minYield,
        uint16 _maxYield,
        uint16 _step,
        uint256 _yieldPeriod
    ) external onlyOwner {
        _addStakableToken(_token, _minYield, _maxYield, _step, _yieldPeriod);
    }

    /**
     * Stakes a given token id from a given contract.
     * @param _token the address of the stakable token.
     * @param _tokenId the id of the token to stake.
     * @dev the contract must be approved to transfer that token first.
     *      the address must be a stakable token.
     */
    function stake(address _token, uint256 _tokenId) external {
        _stakeFor(msg.sender, _token, _tokenId);
    }

    /**
     * Stakes a given token id from a given contract.
     * @param _user the user from which to transfer the token.
     * @param _token the address of the stakable token.
     * @param _tokenId the id of the token to stake.
     * @dev the contract must be approved to transfer that token first.
     *      the address must be a stakable token.
     */
    function stakeFor(
        address _user,
        address _token,
        uint256 _tokenId
    ) external {
        _stakeFor(_user, _token, _tokenId);
    }

    /**
     * Unstakes a given token held by the calling user.
     * @param _token the address of the token contract that the token belongs to.
     * @param _tokenId the id of the token to unstake.
     * @dev reverts if the token is not owned by the caller.
     */
    function unstake(address _token, uint256 _tokenId) external {
        require(
            stakableTokenAttributes[_token].stakedTokens[_tokenId].owner ==
                msg.sender,
            "Not owner"
        );
        _unstake(_token, _tokenId);
    }

    /**
     * Claims the rewards for the caller.
     */
    function claimRewards() external {
        _withdrawRewards(msg.sender);
    }

    /**
     * Gets the College Credit dividend of the provided user.
     * @param _user the user whose dividend we are checking.
     */
    function dividendOf(address _user) external view returns (uint256) {
        return _dividendOf(_user);
    }

    /**
     * Unstakes a given token held by the calling user AND withdraws all dividends.
     * @param _token the address of the token contract that the token belongs to.
     * @param _tokenId the id of the token to unstake.
     * @dev reverts if the token is not owned by the caller.
     */
    function unstakeAndClaimRewards(
        address _token,
        uint256 _tokenId,
        address _user
    ) external {
        require(
            stakableTokenAttributes[_token].stakedTokens[_tokenId].owner ==
                msg.sender,
            "Not owner"
        );
        _withdrawRewards(_user);
        _unstake(_token, _tokenId);
    }

    /**
     * Gets the total amount of tokens staked for the given user in the given contract.
     * @param _user the user whose stakes are being counted.
     * @param _token the address of the contract whose staked tokens we are skimming.
     * @dev reverts if called on an invalid token address.
     */
    function totalStakedFor(address _user, address _token)
        external
        view
        returns (uint256)
    {
        require(_isStakable(_token), "Not stakable");
        uint256 amount = 0;

        uint256 i = 0;
        for (
            i;
            i < stakableTokenAttributes[_token].stakedTokenIds.length;
            i++
        ) {
            if (
                stakableTokenAttributes[_token]
                    .stakedTokens[
                        stakableTokenAttributes[_token].stakedTokenIds[i]
                    ]
                    .owner == _user
            ) {
                amount++;
            }
        }

        return amount;
    }

    /**
     * Gets the total amount staked for a given token address.
     * @param _token the address to get the amount staked from.
     */
    function totalStaked(address _token) external view returns (uint256) {
        return stakableTokenAttributes[_token].stakedTokenIds.length;
    }

    // --------------- INTERNAL FUNCTIONS -----------------

    /**
     * @return if the given token address is stakable.
     * @dev does not check if is ERC721, that is up to the user.
     */
    function _isStakable(address _token) internal view returns (bool) {
        return stakableTokenAttributes[_token].maxYield != 0;
    }

    /**
     * Adds a given token to the list of stakable tokens.
     * @param _token the first stakable token address.
     * @param _minYield the minimum yield for the stakable token.
     * @param _maxYield the maximum yield for the stakable token.
     * @param _step the amount yield increases per yield period.
     * @param _yieldPeriod the length (in seconds) of a yield period (the amount of period after which a yield is calculated)
     */
    function _addStakableToken(
        address _token,
        uint16 _minYield,
        uint16 _maxYield,
        uint16 _step,
        uint256 _yieldPeriod
    ) internal {
        stakableTokenAttributes[_token].maxYield = _maxYield;
        stakableTokenAttributes[_token].minYield = _minYield;
        stakableTokenAttributes[_token].step = _step;
        stakableTokenAttributes[_token].yieldPeriod = _yieldPeriod;

        stakableTokens.push(_token);
    }

    /**
     * Stakes a given token id from a given contract.
     * @param _user the user from which to transfer the token.
     * @param _token the address of the stakable token.
     * @param _tokenId the id of the token to stake.
     * @dev the contract must be approved to transfer that token first.
     *      the address must be a stakable token.
     */
    function _stakeFor(
        address _user,
        address _token,
        uint256 _tokenId
    ) internal {
        require(_isStakable(_token), "Not stakable");
        IERC721(_token).transferFrom(_user, address(this), _tokenId);

        stakableTokenAttributes[_token]
            .stakedTokens[_tokenId]
            .stakeTimestamp = block.timestamp;
        stakableTokenAttributes[_token].stakedTokens[_tokenId].owner = _user;
        stakableTokenAttributes[_token].stakedTokenIds.push(_tokenId);
    }

    /**
     * Retrieves the dividend owed on a particular token with a given timestamp.
     * @param _tokenAttributes the attributes of the token provided.
     * @param _timestamp the timestamp at which the token was staked.
     * @return the dividend owed for that specific token.
     * @dev reverts if the timestamp is 0.
     */
    function _tokenDividend(
        StakableTokenAttributes storage _tokenAttributes,
        uint256 _timestamp
    ) internal view returns (uint256) {
        require(_timestamp != 0, "Not staked");

        uint256 periods = (block.timestamp - _timestamp) /
            _tokenAttributes.yieldPeriod;

        if (periods == 0) return 0;

        uint256 uncappedYield = _tokenAttributes.minYield +
            periods *
            _tokenAttributes.step;

        return
            uncappedYield > _tokenAttributes.maxYield
                ? _tokenAttributes.maxYield
                : uncappedYield;
    }

    /**
     * Gets the College Credit dividend of the provided user.
     * @param _user the user whose dividend we are checking.
     */
    function _dividendOf(address _user) internal view returns (uint256) {
        uint256 dividend = 0;

        uint256 tokenIndex = 0;
        for (tokenIndex; tokenIndex < stakableTokens.length; tokenIndex++) {
            uint256 tokenIdIndex = 0;
            for (
                tokenIdIndex;
                tokenIdIndex <
                stakableTokenAttributes[stakableTokens[tokenIndex]]
                    .stakedTokenIds
                    .length;
                tokenIndex++
            ) {
                StakedToken memory stakedToken = stakableTokenAttributes[
                    stakableTokens[tokenIndex]
                ].stakedTokens[
                        stakableTokenAttributes[stakableTokens[tokenIndex]]
                            .stakedTokenIds[tokenIdIndex]
                    ];

                if (stakedToken.owner != _user) continue;
                dividend += _tokenDividend(
                    stakableTokenAttributes[stakableTokens[tokenIndex]],
                    stakedToken.stakeTimestamp
                );
            }
        }

        return dividend + rewardModifier[_user];
    }

    /**
     * Unstakes a given token id.
     * @param _token the address of the token contract that the token belongs to.
     * @param _tokenId the id of the token to unstake.
     * @dev does not check permissions.
     */
    function _unstake(address _token, uint256 _tokenId) internal {
        address owner = stakableTokenAttributes[_token]
            .stakedTokens[_tokenId]
            .owner;

        // will fail to get dividend if not staked or bad token contract
        uint256 dividend = _tokenDividend(
            stakableTokenAttributes[_token],
            stakableTokenAttributes[_token]
                .stakedTokens[_tokenId]
                .stakeTimestamp
        );

        rewardModifier[owner] += dividend;
        delete stakableTokenAttributes[_token].stakedTokens[_tokenId];

        for (
            uint256 i = 0;
            i < stakableTokenAttributes[_token].stakedTokenIds.length;
            i++
        ) {
            if (stakableTokenAttributes[_token].stakedTokenIds[i] == _tokenId) {
                delete stakableTokenAttributes[_token].stakedTokenIds[i];
            }
        }

        IERC721(_token).safeTransferFrom(address(this), owner, _tokenId);
    }

    /**
     * Claims the dividend for the user.
     * @param _user the user whose rewards are being withdrawn.
     * @dev does not check is the user has permission to withdraw.
     */
    function _withdrawRewards(address _user) internal {
        uint256 dividend = _dividendOf(_user);
        rewardModifier[_user] -= dividend;

        rewardToken.mint(_user, dividend);
    }
}
