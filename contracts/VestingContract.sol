// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract VestingStaking is ReentrancyGuard{
   
    bool public isVestingStarted;
    bool public memberParamsSet;
    address public userAddress;


    IERC20 public token;
    uint256 public totalSupply;
    uint256 public dayInSeconds;

    // STRUCTS
    struct Member {
        uint256 tokenPercentage; // 10000 basis points
        uint256 monthlyPercentage;  // 10000 basis points
        uint256 numberOfMonths;
        uint256 lastClaimed;
        uint256 totalTokenAmount;
        uint256 amountClaimed;
        address memberAddress;
        uint256 startTime;
    }

    // MAPPINGS
    mapping(address => Member) public addressToMember;

    // EVENTS
    event VestingStarted();
    event TeamTokensClaimed(uint amountClaimed);
    

    constructor(address _token, address _userAddress) {
        token = IERC20(_token);
        userAddress =_userAddress;
        totalSupply = 5e7 * 10 ** 18;
        dayInSeconds = 86400 seconds;   

        console.log("owner_address3",msg.sender);
    }

    function startVesting() external {
        require(!isVestingStarted, "Vesting Already Started");
        console.log("BBBBBBBB",msg.sender,address(this),totalSupply);
        bool success = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            totalSupply
        );

        if(!success) revert();

        _setMemberParams(userAddress);

        emit VestingStarted();
    }

    function _setMemberParams(address _userAddress) private {
        require(!memberParamsSet,"member params Already set");
        uint64 blockTimestamp64 = uint64(block.timestamp);
        uint128 blockTimestamp = uint128(block.timestamp);

        addressToMember[_userAddress] = Member(
            1500, 
            0,
            0,
            blockTimestamp,
            (totalSupply * 1500) / 10000,
            0,
            _userAddress,
            blockTimestamp64
        );

        addressToMember[_userAddress] = Member(
            3000, 
            0,
            30,
            blockTimestamp,
            (totalSupply * 3000) / 10000,
            0,
            _userAddress,
            blockTimestamp64
        );

        addressToMember[_userAddress] = Member(
            4500, 
            0,
            90,
            blockTimestamp,
            (totalSupply * 4500) / 10000,
            0,
            _userAddress,
            blockTimestamp64
        );

        addressToMember[_userAddress] = Member(
            1000, 
            0,
            105,
            blockTimestamp,
            (totalSupply * 1000) / 10000,
            0,
            _userAddress,
            blockTimestamp64
        );

        memberParamsSet = true;

    }

    function claimTeamTokens() external {
        Member storage member = addressToMember[userAddress];

        require(msg.sender == member.memberAddress, "ONLY_USER");

        _calcTeamAdvTokens(member);

        member.amountClaimed += member.totalTokenAmount;
        member.lastClaimed = uint128(block.timestamp);

        bool success = token.transfer(
            member.memberAddress,
            member.totalTokenAmount
        );
        if (!success) revert();

        emit TeamTokensClaimed(member.totalTokenAmount);
    
    }

     function _calcTeamAdvTokens(Member storage member) internal view {
        require(
            block.timestamp >
                member.startTime + 24 * dayInSeconds,
            "Vesting Period not completed"
        );

        require(
            member.amountClaimed <= member.totalTokenAmount,
            "Vesting Amount Exceeded"
        );
    }
}