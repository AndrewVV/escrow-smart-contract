// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

// Uncomment this line to use console.log()
// import "hardhat/console.sol";

contract Escrow {
    event Deposited(address payee, uint256 weiAmount);
    event Withdrawn(address payee, uint256 weiAmount);

    mapping(address => uint256) private _deposits;
    mapping(address => address) private _sender;
    mapping(address => bool) private _verify;

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
        bool status = _verify[payee];
        require(status == true, "Status verify is false, please ask deposit sender to verify");
        require(msg.sender == payee, "Address payee is not address msg.sender, please change the payee");
        uint256 amount = _deposits[payee];
        _deposits[payee] = 0;
        payee.transfer(amount);
        emit Withdrawn(payee, amount);
    }

    function verify(address payee) public {
        address sender = _sender[payee];
        require(msg.sender == sender, "Address sender deposit is not address msg.sender, please change the payee");
        _verify[payee] = true;
    }

    function verifyOf(address payee) public view returns (bool) {
        return _verify[payee];
    }
}

// TODO update mapping _sender address => (address => address)