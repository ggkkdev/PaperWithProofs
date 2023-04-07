// SPDX-License-Identifier: MIT
// Inspired by https://solidity-by-example.org/defi/staking-rewards/
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./EZKLVerifier.sol";
import "./RewardToken.sol";

    error TransferFailed();
    error NeedsMoreThanZero();

/**
 * @dev Creates papers and verify it
 */
contract PaperFactory is ReentrancyGuard {
    RewardToken public rewardToken;
    uint rewardPerCitation = 10 ** 3;

    struct Paper {
        string url;
        string identifier;
        address owner;
        string title;
        bool verified;
        uint nbOfCitation;
    }

    mapping(string => Paper) public papers;
    mapping(string => string[]) public citations;

    event RewardsClaimed(address indexed user, string paper, uint256 indexed amount);
    event PaperCreated(string url, string identifier, address owner, string title, bool verified);
    event PaperVerified(string identifier, bool result);
    event PaperCitations(string identifier, string[] citations);

    /**
     * @dev Set the reward token in the constructor
   * @param rewardsToken reward's token address
   */
    constructor(address rewardsToken) {
        rewardToken = RewardToken(rewardsToken);
    }

    /**
     * @notice create Paper
   */
    function createPaper(
        string memory _url,
        string memory _identifier,
        string memory _title
    ) external {
        // @dev check if the _identifier already exist
        require(keccak256(abi.encodePacked(papers[_identifier].identifier)) != keccak256(abi.encodePacked(_identifier, "paper already exists")));
        papers[_identifier] = Paper({url : _url, identifier : _identifier, owner : msg.sender, title : _title, verified : false, nbOfCitation : 0});
        emit PaperCreated(_url, _identifier, msg.sender, _title, false);
    }

    /**
     @dev For one paper, cite multiple papers by their identifiers
    */
    function cite(string memory _identifier, string[] memory _citations) external {
        require(msg.sender == papers[_identifier].owner);
        citations[_identifier] = _citations;
        for (uint i = 0; i < _citations.length; i++) {
            // @dev check if cited paper exists
            string memory _citation = _citations[i];
            require(papers[_citation].owner != address(0));
            papers[_citation].nbOfCitation++;
            rewardToken.mint(papers[_citation].owner, rewardPerCitation);
        }
        emit PaperCitations(_identifier, _citations);
    }

    function verifyMock(string memory _proof, string memory _identifier) external returns (bool) {
        papers[_identifier].verified = true;
        emit PaperVerified(_identifier, true);
        return true;
    }

    /**
    @dev verify the proof of execution for the
    **/
    function verify(string memory _identifier, uint256[] memory pubInputs, bytes memory proof, address verifierAddress) external returns (bool) {
        EZKLVerifier verifier = EZKLVerifier(verifierAddress);
        bool result = verifier.verify(pubInputs, proof);
        // @dev TODO emit only when verified is true
        papers[_identifier].verified = true;
        emit PaperVerified(_identifier, result);
    }

    /********************/
    /* Frontend Functions */
    /********************/

    function getPaper(string memory identifier) external view returns (Paper memory) {
        return papers[identifier];
    }
}
