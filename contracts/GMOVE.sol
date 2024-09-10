// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GMOVE is ERC20 {
    constructor(uint256 initialSupply) ERC20("GMOVER", "GMOVE") {
        _mint(msg.sender, initialSupply);
    }

    // Tokenin 18 ondalık basamaklı olması varsayılan ayardır.
}
