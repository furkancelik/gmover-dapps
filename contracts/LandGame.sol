// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LandGame is Ownable {
    uint256 public constant GRID_SIZE = 7;
    uint256 public RESOURCE_CLAIM_INTERVAL = 10; // Artık sabit değil, değiştirilebilir
    uint256 public constant RESOURCE_AMOUNT = 1;
    uint256 public constant GMOVE_CLAIM_AMOUNT = 1000 * 10 ** 18;

    string public constant DEFAULT_STATE = "dry";

    IERC20 public gmoveToken;

    mapping(address => string[][]) public lands;
    mapping(address => uint256) public resources;
    mapping(address => uint256) public lastResourceClaimTime;
    mapping(address => bool) public hasClaimedLand;

    event LandClaimed(address indexed user, string[][] land);
    event ResourceClaimed(address indexed user, uint256 amount, uint256 time);
    event ResourceSpent(address indexed user, uint256 amount, string[][] land);
    event LandUpdated(
        address indexed user,
        uint256 row,
        uint256 col,
        string newState
    );
    event GMOVEDistributed(address indexed user, uint256 amount);
    event ResourceClaimIntervalUpdated(uint256 newInterval);

    constructor(address _gmoveToken) Ownable(msg.sender) {
        gmoveToken = IERC20(_gmoveToken);
    }

    function setResourceClaimInterval(uint256 newInterval) external onlyOwner {
        RESOURCE_CLAIM_INTERVAL = newInterval;
        emit ResourceClaimIntervalUpdated(newInterval);
    }

    function claimLand() public {
        require(
            !hasClaimedLand[msg.sender],
            "You have already claimed your land."
        );
        require(
            gmoveToken.balanceOf(address(this)) >= GMOVE_CLAIM_AMOUNT,
            "Insufficient GMOVE balance in contract"
        );

        string[][] memory newLand = new string[][](GRID_SIZE);
        for (uint256 i = 0; i < GRID_SIZE; i++) {
            string[] memory row = new string[](GRID_SIZE);
            for (uint256 j = 0; j < GRID_SIZE; j++) {
                row[j] = DEFAULT_STATE;
            }
            newLand[i] = row;
        }

        lands[msg.sender] = newLand;
        hasClaimedLand[msg.sender] = true;

        // GMOVE token'ları kullanıcıya gönder
        require(
            gmoveToken.transfer(msg.sender, GMOVE_CLAIM_AMOUNT),
            "GMOVE transfer failed"
        );

        emit LandClaimed(msg.sender, newLand);
        emit GMOVEDistributed(msg.sender, GMOVE_CLAIM_AMOUNT);
    }

    // Kullanıcının mevcut land state'ini döndür
    function getLandState() public view returns (string[][] memory) {
        require(
            lands[msg.sender].length > 0,
            "You need to claim your land first."
        );
        return lands[msg.sender];
    }

    function updateLandAndUseResources(
        uint256 row,
        uint256 col,
        string memory newState,
        uint256 resourceAmount
    ) public {
        require(
            lands[msg.sender].length > 0,
            "You need to claim your land first."
        );
        require(row < GRID_SIZE && col < GRID_SIZE, "Invalid coordinates.");
        require(
            resources[msg.sender] >= resourceAmount,
            "Not enough resources."
        );

        lands[msg.sender][row][col] = newState;
        resources[msg.sender] -= resourceAmount;

        emit ResourceSpent(
            msg.sender,
            resources[msg.sender],
            lands[msg.sender]
        );
        emit LandUpdated(msg.sender, row, col, newState);
    }

    function updateLandStateForStaking(
        address user,
        uint256 row,
        uint256 col,
        string memory newState
    ) external {
        require(lands[user].length > 0, "User needs to claim land first");
        require(row < GRID_SIZE && col < GRID_SIZE, "Invalid coordinates");

        lands[user][row][col] = newState;

        emit LandUpdated(user, row, col, newState);
    }

    function claimResource() public {
        require(
            lands[msg.sender].length > 0,
            "You need to claim your land first."
        );

        require(
            block.timestamp >=
                lastResourceClaimTime[msg.sender] + RESOURCE_CLAIM_INTERVAL,
            "You can only claim resources once every 1 day."
        );

        resources[msg.sender] += RESOURCE_AMOUNT;
        lastResourceClaimTime[msg.sender] = block.timestamp;

        emit ResourceClaimed(
            msg.sender,
            resources[msg.sender],
            block.timestamp
        );
    }

    function getLastResourceClaimTime() public view returns (uint256) {
        return lastResourceClaimTime[msg.sender];
    }

    // GMOVE token'larını kontrata aktarmak için bir fonksiyon
    function depositGMOVE(uint256 amount) external onlyOwner {
        require(
            gmoveToken.transferFrom(msg.sender, address(this), amount),
            "GMOVE transfer failed"
        );
    }

    // Kalan GMOVE token'larını çekmek için bir fonksiyon
    function withdrawGMOVE(uint256 amount) external onlyOwner {
        require(
            gmoveToken.transfer(msg.sender, amount),
            "GMOVE transfer failed"
        );
    }
}
