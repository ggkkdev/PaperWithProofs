
module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy, log} = deployments
  const {deployer} = await getNamedAccounts()
  const rewardToken = await deployments.get("RewardToken")
  const waitBlockConfirmations = 1
  log("----------------------------------------------------")

  await deploy("PaperFactory", {
    from: deployer,
    args: [rewardToken.address],
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })
  await deploy("MockVerifier", {
    from: deployer,
    log: true,
  })

  log("----------------------------------------------------")
}

module.exports.tags = ["all", "paper"]
