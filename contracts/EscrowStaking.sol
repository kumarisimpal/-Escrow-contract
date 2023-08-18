// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract EscrowStaking is UUPSUpgradeable, ReentrancyGuard, AccessControlUpgradeable, OwnableUpgradeable {
    bytes32 constant DEVELOPER_ROLE = keccak256("DEVELOPER_ROLE");
    bytes32 constant ADMIN_ROLE = keccak256("ADMIN_ROLE");  
  
    IERC20 public token;
  
    mapping(address => bool) public admin;
    mapping(address => bool) public developer;
    mapping(address => bool) public whiteListed;

    // EVENTS
    event successfulDeposit();
    event successfulWithdraw();

    // CUSTOM ERRORS
    error AddressZero();
    error youAreNotAdmin();
    error youAreNotDeveloper();
    error InvalidAmount();
    error tokenNotWhiteListed();

    modifier addressZeroCheck(address to) {
        if (to == address(0)) {
            revert AddressZero();
        }
        _;
    }

    modifier onlyAdmin() {
        if(admin[msg.sender] == false) {
            revert youAreNotAdmin();
        }
        _;
    } 

     modifier onlyDeveloper() {
        if(developer[msg.sender] == false){
            revert youAreNotDeveloper();
        }
        _;
    } 

    constructor() {
        _disableInitializers();
    }

    function initialize(
        IERC20 _token
    ) external initializer {

        token = _token;
        __Ownable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

    }

    function setAdmin(
        address _newAdmin
    ) external addressZeroCheck(_newAdmin) onlyOwner {
        admin[_newAdmin] = true;
        _setupRole(ADMIN_ROLE, _newAdmin);

    
    }

    function setDeveloper(
        address _newDeveloper
    ) external addressZeroCheck(_newDeveloper) onlyAdmin() {
        developer[_newDeveloper] = true;
        _setupRole(DEVELOPER_ROLE, _newDeveloper);
    }

    function setWhiteList(address listOfAddresses) public addressZeroCheck(listOfAddresses) onlyOwner {       
        whiteListed[listOfAddresses] = true;
    }


    function deposit(address _token, uint256 amount) public onlyAdmin {
        if(amount == 0){
            revert InvalidAmount();
        }
        if(whiteListed[_token] == false){
            revert tokenNotWhiteListed();
        }
        token.transferFrom(msg.sender, address(this), amount);
        emit successfulDeposit();
    }

    function withdraw( address _vestingContrct, uint256 amount) public onlyDeveloper{
        if(amount == 0){
            revert InvalidAmount();
        }
        token.transfer(_vestingContrct, amount);
        emit successfulWithdraw();
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}
}
