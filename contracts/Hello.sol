// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract HelloWorld {
    string private greeting;

    constructor() {
        greeting = "Hello Wol!";
    }

    function getGreeting() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _newGreeting) public {
        greeting = _newGreeting;
    }
}
