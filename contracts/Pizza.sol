// SPDX-License-Identifier: MIT
pragma solidity =0.8.17;

// Open Zeppelin libraries for controlling upgradability and access.
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Pizza is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public slices;

    // EVENTS
    event SlicesEaten(uint256 slicesRemaining);

    // CUSTOM ERRORS
    error InvalidSliceCount(); // Error to be thrown when an invalid number is provided.
    error NoSlicesLeft();

/// @custom:oz-upgrades-unsafe-allow constructor 
    constructor() {
        _disableInitializers();
    }

    ///@dev decrements the slices when called
    function eatSlice() external {
        // require(slices > 1, "no slices left");
        if (slices < 1) revert NoSlicesLeft();
        slices -= 1;

        emit SlicesEaten(slices);
    }

    ///@dev no constructor in upgradable contracts. Instead we have initializers
    ///@param _sliceCount initial number of slices for the pizza
    function initialize(uint256 _sliceCount) external initializer {
        if (_sliceCount > 8) revert InvalidSliceCount();
        slices = _sliceCount;

        ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
        __Ownable_init();
    }

    ///@dev required by the OZ UUPS module
    ///@dev INCLUDE THIS FUNCTION AT ALL COSTS IN ALL IMPLEMENTATIONS OTHERWISE IT WON'T BE UPGRADED
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
