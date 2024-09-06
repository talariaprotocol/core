import { join } from 'path'
import { ethers } from 'hardhat'
import { AddressFreeBridge, AddressFreeBridge__factory } from '../typechain-types'
import { HardhatRuntimeEnvironment, HttpNetworkConfig } from 'hardhat/types'
import { JsonRpcProvider } from 'ethers'
import { deployerPrivateKey } from '../hardhat.config'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config({ path: join(__dirname, '../../.env') })

// Read addresses from deployments/addresses.json
const addresses = require('../deployments/addresses.json')

// Dynamically find chains with AddressFreeBridge and set peers across them
async function setPeers() {
  const hre = require('hardhat') as HardhatRuntimeEnvironment
  const { ethers, network } = hre

  // Find all chains with AddressFreeBridge
  const chains = Object.keys(addresses).filter((chain) => addresses[chain].AddressFreeBridge)

  // Iterate over each chain
  for (const chain of chains) {
    console.log(`Processing ${chain} network...`)

    // Get the bridge contract address for the current chain
    const bridgeAddress = addresses[chain]?.AddressFreeBridge
    if (!bridgeAddress) {
      console.log(`No bridge address found for ${chain}, skipping...`)
      continue
    }
    // Get the chain's network configuration
    const networkConfig = hre.config.networks[chain] as HttpNetworkConfig | undefined
    if (!networkConfig || !networkConfig.url) {
      console.log(`No network config or RPC URL found for ${chain}, skipping...`)
      continue
    }

    // Create a provider for this specific network using the URL from the config
    // Use ethers.js directly to connect to the specific network
    const provider = new JsonRpcProvider(networkConfig.url)
    const wallet = new ethers.Wallet(deployerPrivateKey, provider) // Use the private key to create the signer

    const BridgeFactory = await ethers.getContractFactory('AddressFreeBridge', wallet)
    const bridge = BridgeFactory.attach(bridgeAddress).connect(wallet) as AddressFreeBridge

    // Iterate over other chains and set peers
    for (const peerChain of chains) {
      if (peerChain === chain) continue

      // Get the peer chain's bridge address
      const peerBridgeAddress = addresses[peerChain]?.AddressFreeBridge
      if (!peerBridgeAddress) {
        console.log(`No bridge address found for ${peerChain}, skipping...`)
        continue
      }

      // Get the peer chain's chain ID from Hardhat config
      const peerChainId = hre.config.networks[peerChain]?.chainId
      if (!peerChainId) {
        console.log(`No chain ID found for ${peerChain}, skipping...`)
        continue
      }

      // Set peer on the current chain
      const tx = await bridge.setPeer(peerChainId, ethers.zeroPadValue(peerBridgeAddress, 32))
      console.log(`Set peer for ${chain} -> ${peerChain}, Tx: ${tx.hash}`)

      // Wait for the transaction to be confirmed
      await tx.wait()

      // Print the scanner link for the transaction
      const scannerUrl = getScannerUrl(network.name, tx.hash)
      console.log(`Transaction confirmed: ${scannerUrl}`)
    }
  }
}

// Function to generate a block explorer URL for different networks
function getScannerUrl(network: string, txHash: string): string {
  switch (network) {
    case 'sepolia':
      return `https://sepolia.etherscan.io/tx/${txHash}`
    case 'arbitrumSepolia':
      return `https://goerli.arbiscan.io/tx/${txHash}`
    case 'optimismSepolia':
      return `https://goerli-optimism.etherscan.io/tx/${txHash}`
    case 'avalancheFuji':
      return `https://testnet.snowtrace.io/tx/${txHash}`
    case 'polygonAmoy':
      return `https://mumbai.polygonscan.com/tx/${txHash}`
    case 'morphHolesky':
      return `https://goerli.morphscan.io/tx/${txHash}`
    case 'baseSepolia':
      return `https://goerli.basescan.org/tx/${txHash}`
    case 'zkSyncSepolia':
      return `https://goerli.zksync.io/tx/${txHash}`
    default:
      return `https://etherscan.io/tx/${txHash}`
  }
}

setPeers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
