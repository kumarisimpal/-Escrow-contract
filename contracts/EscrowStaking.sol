// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Open Zeppelin libraries for controlling upgradability and access.
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "contracts/interfaces/IERC20.sol";

contract EscrowStaking is Initializable, UUPSUpgradeable, AccessControl, ReentrancyGuard {
    IERC20 public token;
    address private _admin;

    // EVENTS
    event transferredAdminship(address newAdmin);
    event successfulDeposit();
    event successfulWithdraw();
    event AdminshipTransferred(address indexed oldAdmin, address indexed newAdmin);


    // CUSTOM ERRORS
    error AddressZero();

    modifier addressZeroCheck(address to) {
        if(to == address(0)){
            revert AddressZero();
        }
        _;
    }

    modifier onlyAdmin {
      require(msg.sender == _admin);
      _;
   }

    constructor() {
        _disableInitializers();
    }


    function initialize(IERC20 _token) external initializer {
        token = _token;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function transferAdminship(address newAdmin) public virtual onlyAdmin() {
        require(newAdmin != address(0), "Ownable: new owner is the zero address");
        _transferAdminship(newAdmin);
        emit transferredAdminship(newAdmin);
    }

    function deposit(uint256 amount) public  onlyAdmin{
        require(amount > 0," Token amount must be greater than 0");
        token.transferFrom(msg.sender, address(this), amount);
        emit successfulDeposit();
    }

     function withdraw (address developer, uint256 amount) public addressZeroCheck(developer){
        require(amount > 0," Token amount must be greater than 0");
        token.transfer(developer, amount);
        emit successfulWithdraw();
    }

    function _transferAdminship(address newAdmin) internal virtual {
        address oldAdmin = _admin;
        _admin = newAdmin;
        emit AdminshipTransferred(oldAdmin, newAdmin);
    }

    function _authorizeUpgrade(address) internal override onlyAdmin() {}
}
