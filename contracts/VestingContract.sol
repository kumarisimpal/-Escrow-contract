// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract VestingStaking {
   
    bool public isVestingStarted;
    IERC20 public token;
    uint256 public dayInSeconds;

    // STRUCTS
    struct Stake {
        uint256 amount;
        uint64 unlockTime;
        uint64 withdrawTime;
    }


    // MAPPINGS
    mapping(address => Stake) public userStake;

    // EVENTS
    event VestingStarted();
    event TokensClaimed(uint amountClaimed);

    error zeroAmount();

    constructor(IERC20 _token) {
        token = _token;
    }

    function startVesting() public {
        require(!isVestingStarted, "Vesting Already Started");  
        uint256 totalAmount = token.balanceOf(address(this));
        userStake[msg.sender] = Stake(
            totalAmount,
            userStake[msg.sender].unlockTime,
            uint64(block.timestamp)
        );
        bool success = token.transfer(address(this), totalAmount);

        if(!success) revert();
        emit VestingStarted();
    }


    function claimTokens() public {
        Stake storage stake = userStake[msg.sender];
        uint64 blockTimestamp64 = uint64(block.timestamp);
        uint256 totalAmount = token.balanceOf(address(this));
        if (totalAmount == 0){
            revert zeroAmount();
        }
        uint64 unlock = blockTimestamp64 - stake.withdrawTime;
       
        if(unlock < 30 days){
           
            userStake[msg.sender] = stake;
            uint256 claimed = totalAmount * 1500 / 10000;
            
            token.transfer(msg.sender, claimed);
            userStake[msg.sender] = Stake(
                totalAmount -= totalAmount * 1500 / 10000,
                unlock,
                stake.withdrawTime
            );

            userStake[msg.sender] = stake;
        }

        else if(unlock >= 30 days && unlock < 90 days){
           
            userStake[msg.sender] = stake;
            uint256 claimed = totalAmount * 3000 / 10000;

            token.transfer(msg.sender, claimed);
            userStake[msg.sender] = Stake(
                totalAmount -= totalAmount * 3000 / 10000,
                unlock,
                stake.withdrawTime
            );

            userStake[msg.sender] = stake;
        }

        else if(unlock >= 90 days && unlock < 105 days){
            
            userStake[msg.sender] = stake;
            uint256 claimed = totalAmount * 4500 / 10000;

            token.transfer(msg.sender, claimed);
            userStake[msg.sender] = Stake(
                totalAmount -= totalAmount * 4500 / 10000,
                unlock,
                stake.withdrawTime
            );

            userStake[msg.sender] = stake;
        }

        else if(unlock >= 105 days){

            userStake[msg.sender] = stake;
            uint256 claimed = totalAmount * 1000 / 10000;
           
            token.transfer(msg.sender, claimed);
            userStake[msg.sender] = Stake(
                totalAmount -= totalAmount * 1000 / 10000,
                unlock,
                stake.withdrawTime
            );
            userStake[msg.sender] = stake;
        }    
    }
}