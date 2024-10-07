import * as dotenv from 'dotenv'
dotenv.config()
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import '@nomicfoundation/hardhat-verify'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'

// Conditionally import zkSync plugins only if needed
if (process.env.DEPLOY_TARGET === 'zksync') {
  console.log('Loading zkSync plugins')

  require('@matterlabs/hardhat-zksync-solc')
  require('@matterlabs/hardhat-zksync-deploy')
}

// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const providerApiKey = process.env.ALCHEMY_API_KEY || 'oKxs-03sij-U_N0iOlrSsZFr29-IqbuF'
// If not set, it uses the hardhat account 0 private key.
export const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || 'DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW'
const blockscoutApiKey = process.env.BLOCKSCOUT_API_KEY || '' // Use a Blockscout API key if required
const polygonApiKey = '3WV3Z8PP7HFSW2E6Z65GR9845PJMW2ET6Z'
const arbitrumApiKey = '1W124WYR21JHW7CWPD5ZDGAKCSP3AIVC7I'

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
        runs: 200,
      },
      viaIR:true
    },
  },
  ...(process.env.DEPLOY_TARGET === 'zksync'
    ? {
        zksolc: {
          version: '1.5.2',
          compilerSource: 'binary',
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
        },
      }
    : {}),
  defaultNetwork: 'localhost',
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === 'true',
      },
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    arbitrumSepolia: {
      chainId: 421614,
      url: `https://arb-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimismSepolia: {
      chainId: 11155420,
      url: `https://opt-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts: [deployerPrivateKey],
    },
    avalancheFuji: {
      chainId: 43113,
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [deployerPrivateKey],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonAmoy: {
      chainId: 80002,
      url: `https://polygon-amoy.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvm: {
      url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvmTestnet: {
      url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    morphHolesky: {
      chainId: 2810,
      url: 'https://rpc-quicknode-holesky.morphl2.io',
      accounts: [deployerPrivateKey],
    },
    chilizSpicy: {
      chainId: 88882,
      url: 'https://chiliz-spicy.publicnode.com',
      accounts: [deployerPrivateKey],
    },
    gnosis: {
      url: 'https://rpc.gnosischain.com',
      accounts: [deployerPrivateKey],
    },
    kinto: {
      chainId: 7887,
      url: 'https://kinto-mainnet.calderachain.xyz/http',
      accounts: [deployerPrivateKey],
      gas: 10000000,
    },
    chiado: {
      url: 'https://rpc.chiadochain.net',
      accounts: [deployerPrivateKey],
    },
    base: {
      url: 'https://mainnet.base.org',
      accounts: [deployerPrivateKey],
    },
    baseSepolia: {
      chainId: 84532,
      url: 'https://sepolia.base.org',
      accounts: [deployerPrivateKey],
    },
    scrollSepolia: {
      url: 'https://sepolia-rpc.scroll.io',
      accounts: [deployerPrivateKey],
    },
    scroll: {
      url: 'https://rpc.scroll.io',
      accounts: [deployerPrivateKey],
    },
    pgn: {
      url: 'https://rpc.publicgoods.network',
      accounts: [deployerPrivateKey],
    },
    pgnTestnet: {
      url: 'https://sepolia.publicgoods.network',
      accounts: [deployerPrivateKey],
    },
    ...(process.env.DEPLOY_TARGET === 'zksync'
      ? {
          zkSyncSepolia: {
            url: 'https://sepolia.era.zksync.dev',
            ethNetwork: 'sepolia', // The Ethereum Web3 RPC URL, or the identifier of the network (e.g. `mainnet` or `sepolia`)
            zksync: true,
            accounts: [deployerPrivateKey],
          },
        }
      : {}),
  },
  // configuration for harhdat-verify plugin
  etherscan: {
    apiKey: {
      polygon: polygonApiKey,
      polygonAmoy: polygonApiKey,
      'optimism-sepolia': etherscanApiKey,
      zkSyncSepolia: etherscanApiKey,
      avalancheFuji: etherscanApiKey,
      arbitrumOne: arbitrumApiKey,
      arbitrumSepolia: arbitrumApiKey,
      morphHolesky: 'anything',
      chilizSpicy: etherscanApiKey,
      kinto: etherscanApiKey,
      default: `${etherscanApiKey}`,
    },
    customChains: [
      {
        network: 'optimism-sepolia',
        chainId: 11155420,
        urls: {
          apiURL: 'https://optimism-sepolia.blockscout.com/api',
          browserURL: 'https://optimism-sepolia.blockscout.com/',
        },
      },
      {
        network: 'zkSyncSepolia',
        chainId: 300,
        urls: {
          apiURL: 'https://block-explorer-api.sepolia.zksync.dev/api',
          browserURL: 'https://sepolia.explorer.zksync.io',
        },
      },
      {
        network: 'polygonAmoy',
        chainId: 80002,
        urls: {
          apiURL: 'https://api-amoy.polygonscan.com/api',
          browserURL: 'https://amoy.polygonscan.com',
        },
      },
      {
        network: 'avalancheFuji',
        chainId: 43113,
        urls: {
          apiURL: 'https://api.avax-test.network/ext/bc/C/rpc',
          browserURL: 'https://cchain.explorer.avax-test.network',
        },
      },
      {
        network: 'arbitrumSepolia',
        chainId: 421611,
        urls: {
          apiURL: 'https://arb-sepolia.blockscout.com/api',
          browserURL: 'https://arb-sepolia.blockscout.com/',
        },
      },
      {
        network: 'morphHolesky',
        chainId: 2810,
        urls: {
          apiURL: 'https://explorer-api-holesky.morphl2.io/api',
          browserURL: 'https://explorer-holesky.morphl2.io',
        },
      },
      {
        network: 'kinto',
        chainId: 7887,
        urls: {
          apiURL: 'https://api.routescan.io/v2/network/mainnet/evm/7887/etherscan/api',
          browserURL: 'https://kintoscan.io',
        },
      },
      {
        network: 'chilizSpicy',
        chainId: 88882,
        urls: {
          apiURL: 'https://api.routescan.io/v2/network/testnet/evm/88882/etherscan/api',
          browserURL: 'https://testnet.chiliscan.com',
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
  // configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
    },
  },
  gasReporter: {
    enabled: false,
  },
}

export default config
