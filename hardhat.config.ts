import "@nomicfoundation/hardhat-toolbox";
import { task } from "hardhat/config";
import dotenv from "dotenv";
import "solidity-coverage";
import "hardhat-contract-sizer";
import "@openzeppelin/hardhat-upgrades";

dotenv.config();
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

export default {
  networks: {
    // localhost: {
    //   url: "http://127.0.0.1:8545",
    // },
    // goerli: {
    //   url: `https://eth-goerli.g.alchemy.com/v2/${process.env.GOERLI_API_KEY}`,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${process.env.SEPOLIA_API_KEY}`,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    // testnet: {
    //   url: "https://bsctestapi.terminet.io/rpc",
    //   chainId: 97,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    // mumbai: {
    //   url: "https://rpc-mumbai.matic.today",
    //   chainId: 80001,
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC,
    //   },
    // },
    // avalanche: {
    //   url: "https://api.avax-test.network/ext/bc/C/rpc",
    //   chainId: 43113,
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC,
    //   },
    // },
    // fantom: {
    //   url: "https://rpc.testnet.fantom.network/",
    //   chainId: 4002,
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC,
    //   },
    // },
    // BinanceMainnet: {
    //   url: "https://bsc-dataseed.binance.org/",
    //   chainId: 56,
    //   // accounts: [process.env.PRIVATE_KEY],
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC,
    //   },
    // },
    // EthereumMainnet: {
    //   url: `https://mainnet.infura.io/v3/${process.env.INFURA_ETH_MAIN_API_KEY}`,
    //   // accounts: [process.env.PRIVATE_KEY],
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC,
    //   },
    // },
    // PolygonMainnet: {
    //   url: `https://polygon-rpc.com/`,
    //   chainId: 137,
    //   // accounts: [process.env.PRIVATE_KEY],
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC,
    //   },
    // },
    // AvalancheMainnet: {
    //   url: "https://avalanche-mainnet.infura.io",
    //   chainId: 43114,
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC,
    //   },
    // },
    // FantomMainnet: {
    //   url: "https://rpc.ftm.tools/",
    //   chainId: 250,
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC,
    //   },
    // },
    hardhat: {
      // accounts: {
      //   mnemonic: process.env.MNEMONIC,
      //   count: 1500,
      // },
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
  },

  etherscan: {
    // apiKey: {
    //   goerli: process.env.ETHERSCAN_API_FOR_ETHEREUM,
    //   sepolia: process.env.ETHERSCAN_API_FOR_ETHEREUM,
    //   testnet: process.env.ETHERSCAN_API_FOR_BSC,
    //   mumbai: process.env.ETHERSCAN_API_FOR_ETHEREUM,
    //   avalanche: process.env.ETHERSCAN_API_FOR_ETHEREUM,
    //   fantom: process.env.ETHERSCAN_API_FOR_ETHEREUM,
    //   BinanceMainnet: process.env.ETHERSCAN_API_FOR_ETHEREUM,
    //   EthereumMainnet: process.env.ETHERSCAN_API_FOR_ETHEREUM,
    //   PolygonMainnet: process.env.ETHERSCAN_API_FOR_ETHEREUM,
    //   AvalancheMainnet: process.env.ETHERSCAN_API_FOR_ETHEREUM,
    //   FantomMainnet: process.env.ETHERSCAN_API_FOR_ETHEREUM
    // }
  },

  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    contractSizer: {
      alphaSort: true,
      disambiguatePaths: false,
      runOnCompile: false,
      strict: true,
    },
  },

  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },

  gasReporter: {
    enabled: false,
  },

  mocha: {
    timeout: 2000000,
  },
};
