// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract Escrow {
    event Deposited(address payee, uint256 weiAmount);
    event Withdrawn(address payee, uint256 weiAmount);

    mapping(address => uint256) private _deposits;
    mapping(address => address) private _sender;

    function deposit(address payee) public payable {
        require(msg.value > 0, "Send value is 0, please set value");
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
        require(payee == msg.sender, "Payee is not msg.sender, please change the payee");
        uint256 amount = _deposits[payee];
        require(amount > 0, "Deposit value for this payee is 0, please make deposit");
        _deposits[payee] = 0;
        payee.transfer(amount);
        emit Withdrawn(payee, amount);
    }
}

// TODO update mapping _sender address => (address => address)