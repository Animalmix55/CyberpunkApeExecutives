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

    mapping(address => uint256) rewardModifier;

    /**
     * A mapping of token addresses to staking configurations
     */
    mapping(address => StakableTokenAttributes) public stakableTokenAttributes;
    address[] stakableTokens;

    ICollegeCredit public rewardToken;

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

    function mintRewardToken(address _recipient, uint256 _amount) external onlyOwner {
        rewardToken.mint(_recipient, _amount);
    }

    function addStakableToken(
        address _token,
        uint16 _minYield,
        uint16 _maxYield,
        uint16 _step,
        uint256 _yieldPeriod
    ) external onlyOwner {
        _addStakableToken(_token, _minYield, _maxYield, _step, _yieldPeriod);
    }

    function stake(address _token, uint256 _tokenId) external {
        _stakeFor(msg.sender, _token, _tokenId);
    }

    function stakeFor(
        address _user,
        address _token,
        uint256 _tokenId
    ) external {
        _stakeFor(_user, _token, _tokenId);
    }

    function unstake(address _token, uint256 _tokenId) external {
        _unstake(_token, _tokenId);
    }

    function claimRewards(address _user) external {
        _withdrawRewards(_user);
    }

    function dividendOf(address _user) external view returns (uint256) {
        return _dividendOf(_user);
    }

    function unstakeAndClaimRewards(
        address _token,
        uint256 _tokenId,
        address _user
    ) external {
        _withdrawRewards(_user);
        _unstake(_token, _tokenId);
    }

    function totalStakedFor(address _addr, address _token)
        external
        view
        returns (uint256)
    {
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
                    .owner == _addr
            ) {
                amount++;
            }
        }

        return amount;
    }

    function totalStaked(address _token) external view returns (uint256) {
        return stakableTokenAttributes[_token].stakedTokenIds.length;
    }

    function token() external view returns (address) {
        return address(rewardToken);
    }

    function supportsHistory() external pure returns (bool) {
        return false;
    }

    // --------------- INTERNAL FUNCTIONS -----------------
    function _isStakable(address _token) internal view returns (bool) {
        return stakableTokenAttributes[_token].maxYield != 0;
    }

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

    function _tokenDividend(
        StakableTokenAttributes storage _tokenAttributes,
        uint256 timestamp
    ) internal view returns (uint256) {
        require(timestamp != 0, "Not staked");

        uint256 periods = (block.timestamp - timestamp) /
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

        IERC721(_token).safeTransferFrom(address(this), owner, _tokenId);
    }

    function _withdrawRewards(address _user) internal {
        uint256 dividend = _dividendOf(_user);
        rewardModifier[_user] -= dividend;

        rewardToken.mint(_user, dividend);
    }
}
