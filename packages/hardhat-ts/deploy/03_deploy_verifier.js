
module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy, log} = deployments
  const {deployer} = await getNamedAccounts()
  const verifier = await deployments.get("Verifier")
  const waitBlockConfirmations = 1
  log("----------------------------------------------------")
  const args = []
  await deploy("Verifier", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })


  log("----------------------------------------------------")
}

module.exports.tags = ["all", "verifier"]
