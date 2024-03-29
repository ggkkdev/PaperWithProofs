// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor() ERC20("Reward Token", "PWP") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount*10 ** 10);
    }
}
