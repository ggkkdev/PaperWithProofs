// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./EZKLVerifier.sol";

contract MockVerifier is EZKLVerifier {
    function verify(uint256[] memory pubInputs, bytes memory proof) override public virtual view returns (bool){
        return true;
    }
}
