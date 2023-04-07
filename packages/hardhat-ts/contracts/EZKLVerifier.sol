// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

abstract contract EZKLVerifier {
    function verify(uint256[] memory pubInputs, bytes memory proof) public virtual view returns (bool);
}
