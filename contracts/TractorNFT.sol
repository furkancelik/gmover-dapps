// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TractorNFT is ERC1155, Ownable {
    uint256 public constant TRACTOR = 1; // Traktör token ID'si
    uint256 public constant TRACTOR_PRICE = 250 * 10 ** 18; // Traktör başına GMOVE fiyatı
    IERC20 public gmoveToken; // GMOVE Token adresi

    // Yeni event tanımı
    event TractorPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 totalPrice
    );

    constructor(
        IERC20 _gmoveToken
    ) ERC1155("https://example.com/api/item/{id}.json") Ownable(msg.sender) {
        gmoveToken = _gmoveToken;
    }

    // GMOVE ile traktör satın alma
    function buyTractor(uint256 amount) public {
        uint256 totalPrice = TRACTOR_PRICE * amount;
        require(
            gmoveToken.balanceOf(msg.sender) >= totalPrice,
            "Not enough GMOVE to buy tractors"
        );
        // GMOVE tokenini kontrata transfer et
        gmoveToken.transferFrom(msg.sender, address(this), totalPrice);
        // Kullanıcıya traktör NFT'si mint ediyoruz
        _mint(msg.sender, TRACTOR, amount, "");

        // Event'i tetikle
        emit TractorPurchased(msg.sender, amount, totalPrice);
    }

    // Sahip tarafından token'ların yeni bir adrese mint edilmesi
    function mintTractor(address to, uint256 amount) public onlyOwner {
        _mint(to, TRACTOR, amount, "");
    }

    // Sahip, kontratta biriken GMOVE tokenlerini çekebilir
    function withdrawGMOVE(uint256 amount) public onlyOwner {
        gmoveToken.transfer(owner(), amount);
    }
}
