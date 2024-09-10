// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TreeNFT is ERC1155, Ownable {
    uint256 public constant TREE = 0; // Ağaç token ID'si
    uint256 public constant TREE_PRICE = 50 * 10 ** 18; // Ağaç başına GMOVE fiyatı
    IERC20 public gmoveToken; // GMOVE Token adresi

    // Güncellenmiş event tanımı
    event TreePurchased(
        address indexed buyer,
        uint256 amount,
        uint256 totalPrice
    );

    constructor(
        IERC20 _gmoveToken
    ) ERC1155("https://example.com/api/item/{id}.json") Ownable(msg.sender) {
        gmoveToken = _gmoveToken;
    }

    // GMOVE ile ağaç satın alma
    function buyTree(uint256 amount) public {
        uint256 totalPrice = TREE_PRICE * amount;
        require(
            gmoveToken.balanceOf(msg.sender) >= totalPrice,
            "Not enough GMOVE to buy trees"
        );
        // GMOVE tokenini kontrata transfer et
        gmoveToken.transferFrom(msg.sender, address(this), totalPrice);
        // Kullanıcıya ağaç NFT'si mint ediyoruz
        _mint(msg.sender, TREE, amount, "");
        // Güncellenmiş event'i emit et
        emit TreePurchased(msg.sender, amount, totalPrice);
    }

    // Sahip tarafından token'ların yeni bir adrese mint edilmesi
    function mintTree(address to, uint256 amount) public onlyOwner {
        _mint(to, TREE, amount, "");
    }

    // Sahip, kontratta biriken GMOVE tokenlerini çekebilir
    function withdrawGMOVE(uint256 amount) public onlyOwner {
        gmoveToken.transfer(owner(), amount);
    }
}
