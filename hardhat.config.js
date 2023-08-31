require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY 
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL 
const PRIVATE_KEY = process.env.PRIVATE_KEY 
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
      // gasPrice: 130000000000,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,

    },
    localhost: {
      url: "http://172.29.160.1:7545", // vEthernet (WSL)
      url: "HTTP://127.0.0.1:7545",  // Loopback Pseudo-Interface 1
      url: "http://192.168.0.192:7545", // WIFI
      chainId: 1337,
    },
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH",
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
  },

  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      // 1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    user: {
      default: 1,
    },
  },

  mocha: {
    timeout: 500000,
  },
}

// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners()

//   for (const account of accounts) {
//     console.log(account.address)
//   }
// })
