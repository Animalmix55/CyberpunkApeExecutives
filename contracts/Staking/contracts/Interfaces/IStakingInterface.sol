pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

// EIP-900

interface IStakingInterface {
    event Staked(address indexed user, uint256 amount, uint256 total, bytes data);
    event Unstaked(address indexed user, uint256 amount, uint256 total, bytes data);

    function stake(address token, uint256 tokenId) external;
    function stakeFor(address user, address token, uint256 tokenId) external;
    function unstake(address token, uint256 tokenId) external;
    function totalStakedFor(address addr, address token) external view returns (uint256);
    function totalStaked(address token) external view returns (uint256);
}