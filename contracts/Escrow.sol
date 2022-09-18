// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract Escrow {
    event Deposited(address payee, uint256 weiAmount);
    event Withdrawn(address payee, uint256 weiAmount);

    mapping(address => uint256) private _deposits;
    mapping(address => address) private _sender;

    // TODO add validation if send amount is 0;
    function deposit(address payee) public payable {
        uint256 amount = msg.value;
        _deposits[payee] = _deposits[payee] + amount;
        _sender[payee] = msg.sender;
        emit Deposited(payee, amount);
    }

    function depositsOf(address payee) public view returns (uint256) {
        return _deposits[payee];
    }

    function sendersOf(address payee) public view returns (address) {
        return _sender[payee];
    }

    function withdraw(address payable payee) public {
        uint256 amount = _deposits[payee];
        _deposits[payee] = 0;
        payee.transfer(amount);
        emit Withdrawn(payee, amount);
    }
}

// TODO update mapping _sender address => (address => address)