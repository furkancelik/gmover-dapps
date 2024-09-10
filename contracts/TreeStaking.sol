// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ILandGame.sol";

contract TreeStaking is ERC1155Holder, Ownable, ReentrancyGuard {
    IERC1155 public immutable treeNFT;
    IERC20 public immutable gmoveToken;
    ILandGame public landGame;

    uint256 public constant TREE_ID = 0;
    uint256 public constant STAKING_PERIOD = 7 days;
    uint256 public constant GRID_SIZE = 7;
    uint256 private constant PRECISION_FACTOR = 1e12;

    uint256 public rewardRate;
    uint256 public totalStakedTrees;
    uint256 public accumulatedRewardPerShare;
    uint256 public lastUpdateTime;

    struct StakeInfo {
        uint256 stakedAt;
        uint256 rewardDebt;
        uint256 lastRewardCalculation;
        uint256 accumulatedReward;
    }

    mapping(address => mapping(uint256 => StakeInfo)) public stakedTrees;
    mapping(address => uint256) public userStakedAmount;
    mapping(address => uint256[]) public userStakedPositions;

    event TreeStaked(
        address indexed user,
        uint256 row,
        uint256 col,
        uint256 timestamp
    );
    event TreeUnstaked(
        address indexed user,
        uint256 row,
        uint256 col,
        uint256 timestamp
    );
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 newRate);

    event RewardClaimedForNFT(
        address indexed user,
        uint256 row,
        uint256 col,
        uint256 amount
    );

    constructor(
        address _treeNFT,
        address _gmoveToken,
        address _landGame,
        uint256 _rewardRate
    ) ERC1155Holder() Ownable(msg.sender) ReentrancyGuard() {
        require(
            _treeNFT != address(0) &&
                _gmoveToken != address(0) &&
                _landGame != address(0),
            "Invalid addresses"
        );
        treeNFT = IERC1155(_treeNFT);
        gmoveToken = IERC20(_gmoveToken);
        landGame = ILandGame(_landGame);
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp;
    }

    function getCellId(uint256 row, uint256 col) public pure returns (uint256) {
        require(row < GRID_SIZE && col < GRID_SIZE, "Invalid grid position");
        return row * GRID_SIZE + col;
    }

    function updateReward() public {
        if (totalStakedTrees == 0) {
            lastUpdateTime = block.timestamp;
            return;
        }
        uint256 timePassed = block.timestamp - lastUpdateTime;
        uint256 reward = (timePassed * rewardRate * totalStakedTrees) / 1 days;
        accumulatedRewardPerShare +=
            (reward * PRECISION_FACTOR) /
            totalStakedTrees;
        lastUpdateTime = block.timestamp;
    }

    function stake(uint256 row, uint256 col) external nonReentrant {
        updateReward();
        uint256 cellId = getCellId(row, col);
        require(
            treeNFT.balanceOf(msg.sender, TREE_ID) >= 1,
            "Insufficient tree balance"
        );
        require(
            stakedTrees[msg.sender][cellId].stakedAt == 0,
            "Cell already staked"
        );

        treeNFT.safeTransferFrom(msg.sender, address(this), TREE_ID, 1, "");

        stakedTrees[msg.sender][cellId] = StakeInfo({
            stakedAt: block.timestamp,
            rewardDebt: accumulatedRewardPerShare,
            lastRewardCalculation: block.timestamp,
            accumulatedReward: 0
        });

        userStakedAmount[msg.sender] += 1;
        userStakedPositions[msg.sender].push(cellId);
        totalStakedTrees += 1;

        landGame.updateLandStateForStaking(msg.sender, row, col, "tree");

        emit TreeStaked(msg.sender, row, col, block.timestamp);
    }

    function unstake(uint256 row, uint256 col) external nonReentrant {
        updateReward();
        uint256 cellId = getCellId(row, col);
        StakeInfo storage stakeInfo = stakedTrees[msg.sender][cellId];
        require(stakeInfo.stakedAt != 0, "No tree staked in this cell");
        require(
            block.timestamp >= stakeInfo.stakedAt + STAKING_PERIOD,
            "Staking period not completed"
        );

        uint256 pending = _calculateReward(msg.sender, cellId);
        if (pending > 0) {
            safeRewardTransfer(msg.sender, pending);
        }

        treeNFT.safeTransferFrom(address(this), msg.sender, TREE_ID, 1, "");

        userStakedAmount[msg.sender] -= 1;
        totalStakedTrees -= 1;

        for (uint256 i = 0; i < userStakedPositions[msg.sender].length; i++) {
            if (userStakedPositions[msg.sender][i] == cellId) {
                userStakedPositions[msg.sender][i] = userStakedPositions[
                    msg.sender
                ][userStakedPositions[msg.sender].length - 1];
                userStakedPositions[msg.sender].pop();
                break;
            }
        }

        delete stakedTrees[msg.sender][cellId];

        landGame.updateLandStateForStaking(msg.sender, row, col, "grass");

        emit TreeUnstaked(msg.sender, row, col, block.timestamp);
    }

    function claimReward(uint256 row, uint256 col) external nonReentrant {
        updateReward();
        uint256 cellId = getCellId(row, col);
        StakeInfo storage stakeInfo = stakedTrees[msg.sender][cellId];

        require(stakeInfo.stakedAt != 0, "No tree staked in this cell");

        uint256 pending = _calculateReward(msg.sender, cellId);
        require(pending > 0, "No rewards to claim");

        stakeInfo.lastRewardCalculation = block.timestamp;
        stakeInfo.rewardDebt = accumulatedRewardPerShare;
        stakeInfo.accumulatedReward = 0;

        safeRewardTransfer(msg.sender, pending);

        emit RewardClaimedForNFT(msg.sender, row, col, pending);
    }

    function claimAllRewards() external nonReentrant {
        updateReward();
        uint256 totalPending = 0;

        for (uint256 i = 0; i < userStakedPositions[msg.sender].length; i++) {
            uint256 cellId = userStakedPositions[msg.sender][i];
            uint256 pending = _calculateReward(msg.sender, cellId);

            if (pending > 0) {
                StakeInfo storage stakeInfo = stakedTrees[msg.sender][cellId];
                stakeInfo.lastRewardCalculation = block.timestamp;
                stakeInfo.rewardDebt = accumulatedRewardPerShare;
                stakeInfo.accumulatedReward = 0;

                totalPending += pending;
            }
        }

        require(totalPending > 0, "No rewards to claim");
        safeRewardTransfer(msg.sender, totalPending);

        emit RewardClaimed(msg.sender, totalPending);
    }

    function _calculateReward(
        address user,
        uint256 cellId
    ) internal view returns (uint256) {
        StakeInfo storage stakeInfo = stakedTrees[user][cellId];
        if (stakeInfo.stakedAt == 0) {
            return 0;
        }
        uint256 newReward = ((accumulatedRewardPerShare -
            stakeInfo.rewardDebt) * 1) / PRECISION_FACTOR;
        return stakeInfo.accumulatedReward + newReward;
    }

    function safeRewardTransfer(address to, uint256 amount) internal {
        uint256 gmoveBal = gmoveToken.balanceOf(address(this));
        if (amount > gmoveBal) {
            gmoveToken.transfer(to, gmoveBal);
        } else {
            gmoveToken.transfer(to, amount);
        }
    }

    function getStakedNFTDetails(
        address user,
        uint256 row,
        uint256 col
    )
        public
        view
        returns (
            uint256 stakedAt,
            uint256 pendingReward,
            uint256 stakedDuration
        )
    {
        uint256 cellId = getCellId(row, col);
        StakeInfo storage stakeInfo = stakedTrees[user][cellId];
        require(stakeInfo.stakedAt != 0, "No tree staked in this cell");

        stakedAt = stakeInfo.stakedAt;
        pendingReward = _calculateReward(user, cellId);
        stakedDuration = block.timestamp - stakeInfo.stakedAt;
    }

    function getUserStakedPositions(
        address user
    ) public view returns (uint256[] memory) {
        return userStakedPositions[user];
    }

    function getTotalStakedNFTs(address user) public view returns (uint256) {
        return userStakedAmount[user];
    }

    function getPendingReward(address user) public view returns (uint256) {
        uint256 pending = 0;
        for (uint256 i = 0; i < userStakedPositions[user].length; i++) {
            uint256 cellId = userStakedPositions[user][i];
            pending += _calculateReward(user, cellId);
        }
        return pending;
    }

    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        updateReward();
        rewardRate = _rewardRate;
        emit RewardRateUpdated(_rewardRate);
    }

    function setLandGameAddress(address _landGame) external onlyOwner {
        require(_landGame != address(0), "Invalid LandGame address");
        landGame = ILandGame(_landGame);
    }

    function withdrawGMOVE(uint256 amount) external onlyOwner {
        uint256 gmoveBal = gmoveToken.balanceOf(address(this));
        require(gmoveBal >= amount, "Insufficient GMOVE balance");
        gmoveToken.transfer(owner(), amount);
    }

    function getUpdatedStakeInfo(
        address user,
        uint256 row,
        uint256 col
    )
        public
        view
        returns (
            uint256 stakedAt,
            uint256 pendingReward,
            uint256 stakedDuration
        )
    {
        uint256 cellId = getCellId(row, col);
        StakeInfo storage stakeInfo = stakedTrees[user][cellId];
        require(stakeInfo.stakedAt != 0, "No tree staked in this cell");

        stakedAt = stakeInfo.stakedAt;
        stakedDuration = block.timestamp - stakeInfo.stakedAt;

        uint256 currentAccumulatedRewardPerShare = accumulatedRewardPerShare;
        if (totalStakedTrees > 0) {
            uint256 timePassed = block.timestamp - lastUpdateTime;
            uint256 reward = (timePassed * rewardRate * totalStakedTrees) /
                1 days;
            currentAccumulatedRewardPerShare +=
                (reward * PRECISION_FACTOR) /
                totalStakedTrees;
        }

        uint256 newReward = ((currentAccumulatedRewardPerShare -
            stakeInfo.rewardDebt) * 1) / PRECISION_FACTOR;
        pendingReward = stakeInfo.accumulatedReward + newReward;
    }
}
