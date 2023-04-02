// SPDX-License-Identifier: MIT
// Inspired by https://solidity-by-example.org/defi/staking-rewards/
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

    error TransferFailed();
    error NeedsMoreThanZero();

/**
 * @dev Creates papers and verify it
 */
contract PaperFactory is ReentrancyGuard {
    IERC20 public rewardToken;

    struct Paper {
        string url;
        string identifier;
        address owner;
        string title;
        bool verified;
        string citation;
        uint nbOfCitation;
    }

    mapping(string => Paper) public papers;

    event RewardsClaimed(address indexed user, string paper, uint256 indexed amount);
    event PaperCreated(string url, string identifier, address owner, string title, bool verified, string citation);

    /**
     * @dev Set the reward token in the constructor
   * @param rewardsToken reward's token address
   */
    constructor(address rewardsToken) {
        rewardToken = IERC20(rewardsToken);
    }

    /**
     * @notice create Paper
   */
    function createPaper(
        string memory _url,
        string memory _identifier,
        string memory _title,
        string memory _citation
    ) external {
        // @dev check if the _identifier already exist
        require(keccak256(abi.encodePacked(papers[_identifier].identifier)) != keccak256(abi.encodePacked(_identifier, "paper already exists")));
        papers[_identifier] = Paper({url : _url, identifier : _identifier, owner : msg.sender, title : _title, verified : false, citation : _citation, nbOfCitation : 0});
        if (bytes(_citation).length != 0) {
            // @dev check if cited paper exists
            require(papers[_citation].owner != address(0));
            papers[_citation].nbOfCitation += 1;
        }
        emit PaperCreated(_url, _identifier, msg.sender, _title, false, _citation);
    }

    function claimReward(string memory _identifier) external nonReentrant {

        uint reward = 1;
        emit RewardsClaimed(msg.sender, _identifier, reward);
        bool success = rewardToken.transfer(msg.sender, reward);
        if (!success) {
            revert TransferFailed();
        }
    }

    /********************/
    /* Frontend Functions */
    /********************/

    function getPaper(string memory identifier) external view returns (Paper memory) {
        return papers[identifier];
    }
}
