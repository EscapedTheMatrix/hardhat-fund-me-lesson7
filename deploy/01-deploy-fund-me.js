// const helper = require("../helper-hardhat-config")
// const networkConfig = helper.networkConfig
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // const address = "0x694AA1769357215DE4FAC081bf1f309aDC325306"  // active if using args : [address]

    // if chainId is X use address Y
    // if chainId is Z use address A
    // const ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"]

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        // if(chainId == 31337){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")

    // const gasPrice = network.config.gasPrice || 50000000000; // Contoh: 50 Gwei
    // const maxFeePerGas = network.config.maxFeePerGas || 1000000000000; // Contoh: 1 Gwei

    // const maxFeePerGas = 5000000000 // 5 Gwei in Wei
    // const maxPriorityFeePerGas = 1000000000 // 1 Gwei in Wei

    const gasPrice = 50000000000 // 50 Gwei in Wei

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        // args: [address], // put price feed address
        // args: [ethUsdPriceFeedAddress],
        args: args,
        log: true,
        gasPrice: gasPrice,
        // maxFeePerGas: maxFeePerGas,
        // maxPriorityFeePerGas: maxPriorityFeePerGas,
        waitConfirmations: network.config.blockConfirmations || 1,
        // we need to wait if on a live network so we can verify properly
        // waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("----------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
