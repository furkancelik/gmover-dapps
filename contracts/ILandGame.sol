// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILandGame {
    function updateLandStateForStaking(
        address user,
        uint256 row,
        uint256 col,
        string memory newState
    ) external;
    function resources(address user) external view returns (uint256);
}
