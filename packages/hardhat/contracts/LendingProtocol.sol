// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { Verifier } from  "./Verifier.sol";

contract LendingProtocol is Ownable, Verifier {
    using SafeERC20 for IERC20;
    
    // Mapping to track borrowed and supplied amounts
    mapping(address => uint256) public totalBorrowed;
    mapping(address => uint256) public totalSupplied;

    uint256 public totalBorrowedAmount;
    uint256 public totalSuppliedAmount;

    // Backend's public key (to verify signatures)
    address public backendSigner;
    address public erc20token;

    event Borrowed(address indexed borrower, uint256 amount);
    event Supplied(address indexed supplier, uint256 amount);
    event Withdrawn(address indexed supplier, uint256 amount);
    event Repaid(address indexed borrower, uint256 amount);

    constructor(address owner, address _backendSigner, address _erc20token) Ownable(owner) {
        require(_backendSigner != address(0), "Invalid signer address");
        backendSigner = _backendSigner;
        erc20token = _erc20token; 
    }

    /**
     * @dev Updates the backend signer address.
     */
    function updateBackendSigner(address _newSigner) external onlyOwner {
        // This could be restricted to onlyOwner in a production system
        require(_newSigner != address(0), "Invalid new signer address");
        backendSigner = _newSigner;
    }

    /**
     * @dev Borrow function to request a loan.
     * @param requestedAmount Amount the borrower wants to borrow.
     * @param creditLimit Credit limit approved for the borrower (from the signed message).
     * @param signature Backend-signed message verifying the credit limit.
     */
    function borrow(uint256 requestedAmount, uint256 creditLimit, bytes memory signature) external {
        require(totalSuppliedAmount >= requestedAmount, "Insufficient liquidity in the pool");

        // Check if the borrower has enough credit limit
        require(totalBorrowed[msg.sender] + requestedAmount <= creditLimit, "Borrowing exceeds credit limit");

        // Verify the signature
        require(verify(backendSigner, abi.encode(msg.sender, creditLimit), signature), "Invalid signature");


        // Update the borrower's total borrowed amount
        totalBorrowed[msg.sender] += requestedAmount;
        totalBorrowedAmount += requestedAmount;

        // Transfer the funds to the borrower
        IERC20(erc20token).transfer(msg.sender, requestedAmount);

        emit Borrowed(msg.sender, requestedAmount);
    }

    function supply(uint256 amount) external {
        IERC20(erc20token).transferFrom(msg.sender, address(this), amount);

        totalSupplied[msg.sender] += amount;
        totalSuppliedAmount += amount;

        emit Supplied(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(totalSupplied[msg.sender] >= amount, "Insufficient supplied amount");

        IERC20(erc20token).transfer(msg.sender, amount);


        totalSupplied[msg.sender] -= amount;
        totalSuppliedAmount -= amount;
    
        emit Withdrawn(msg.sender, amount);
    }

    function repay(uint256 amount) external {
        require(amount <= totalBorrowed[msg.sender], "Too much repaid.");

        IERC20(erc20token).transferFrom(msg.sender, address(this), amount);

        totalBorrowed[msg.sender] -= amount;
        totalBorrowedAmount -= amount;

        emit Repaid(msg.sender, amount);
    }
}
