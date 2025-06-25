// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Roulette
 * @dev A simple roulette game on the BNB Smart Chain.
 */
contract Roulette {
    address public owner;
    uint256 public constant MIN_BET = 0.01 ether;
    uint256 public constant MAX_BET = 1 ether;

    event Play(address indexed player, uint256 betAmount, uint8 guess, uint8 randomNumber, bool won);
    event Withdrawal(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    /**
     * @dev Allows a player to place a bet and play the game.
     * @param guess A number from 1 to 5.
     */
    function play(uint8 guess) public payable {
        require(msg.value >= MIN_BET, "Bet is below the minimum amount.");
        require(msg.value <= MAX_BET, "Bet is above the maximum amount.");
        require(guess >= 1 && guess <= 5, "Guess must be between 1 and 5.");

        uint8 randomNumber = _generateRandomNumber();

        if (guess == randomNumber) {
            uint256 payout = msg.value * 2;
            require(address(this).balance >= payout, "Insufficient funds in the contract for payout.");
            (bool success, ) = msg.sender.call{value: payout}("");
            require(success, "Payout failed.");
            emit Play(msg.sender, msg.value, guess, randomNumber, true);
        } else {
            emit Play(msg.sender, msg.value, guess, randomNumber, false);
        }
    }

    /**
     * @dev Allows the owner to withdraw the entire balance of the contract.
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed.");
        emit Withdrawal(owner, balance);
    }

    /**
     * @dev Internal function to generate a pseudo-random number.
     * Note: This is not cryptographically secure and is for demonstration purposes.
     */
    function _generateRandomNumber() private view returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 5) + 1;
    }

    // Fallback function to receive BNB
    receive() external payable {}
} 