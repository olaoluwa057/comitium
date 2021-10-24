// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.7.6;

import "../interfaces/IComitium.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract MulticallMock {
    using SafeMath for uint256;

    IComitium comitium;
    IERC20 fdt;

    constructor(address _comitium, address _fdt) {
        comitium = IComitium(_comitium);
        fdt = IERC20(_fdt);
    }

    function multiDelegate(uint256 amount, address user1, address user2) public {
        fdt.approve(address(comitium), amount);

        comitium.deposit(amount);
        comitium.delegate(user1);
        comitium.delegate(user2);
        comitium.delegate(user1);
    }

    function multiDeposit(uint256 amount) public {
        fdt.approve(address(comitium), amount.mul(3));

        comitium.deposit(amount);
        comitium.deposit(amount);
        comitium.deposit(amount);
    }
}
