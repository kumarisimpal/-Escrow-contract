// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract TokenA is ERC20, Ownable {   

   constructor() ERC20("TokenA","TKA"){}

    function mint(address to,uint256 amount) public onlyOwner{
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner{
        _burn(from, amount);
    }
}
