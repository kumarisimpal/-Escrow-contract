// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

interface IVESTING {
    function startVesting() external;
    function claimTokens() external;

}