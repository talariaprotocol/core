import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ethers, run } from 'hardhat'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { WorldChampionNFT, WorldChampionNFT__factory, BCN, BCN__factory } from '../typechain-types'
import {
  isLayerZeroNetworkSupported,
  LayerZeroEndpointPerNetwork,
  LayerZeroSupportedChainsType,
} from '../constants/layerzero.constants'
import {
  isWorldcoinNetworkSupported,
  WorldcoinEndpointPerNetwork,
  WorldcoinSupportedChainsType,
} from '../constants/worldcoin.constants'
import {
  isKintoNetworkSupported,
  KintoKYCViewerEndpointPerNetwork,
  KintoSupportedChainsType,
} from '../constants/kinto.constants'
import {
  isPrivadoIdNetworkSupported,
  PrivadoIdEndpointPerNetwork,
  PrivadoIdSupportedChainsType,
} from '../constants/privadoId.constants'

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  // Path to the JSON file
  const addressesFilePath = path.resolve(__dirname, '../deployments/addresses.json')

  // Load existing addresses
  let addresses: any = {}
  try {
    addresses = JSON.parse(readFileSync(addressesFilePath, 'utf-8'))
  } catch (error) {
    console.log('No existing addresses file found, creating a new one.')
  }

  // Ensure there's an entry for the current network
  if (!addresses[network.name]) {
    addresses[network.name] = {}
  }

  const verifier = await deploy('Verifier', {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: false,
  })

  const hasher = await deploy('Hasher', {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: false,
  })

  const levels = 20 // Merkle tree height

  const whitelistFactory = await deploy('WhitelistFactory', {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: false,
    args: [verifier.address, hasher.address, levels],
  })

  // Save addresses
  addresses[network.name] = {
    Verifier: verifier.address,
    Hasher: hasher.address,
    WhitelistFactory: whitelistFactory.address,
  }

  // Write updated addresses back to the JSON file
  writeFileSync(addressesFilePath, JSON.stringify(addresses, null, 2))

  // Verify Contracts
  console.log('Verifying contracts...')

  await run('verify:verify', {
    address: verifier.address,
    constructorArguments: [],
  })

  await run('verify:verify', {
    address: hasher.address,
    constructorArguments: [],
  })

  await run('verify:verify', {
    address: whitelistFactory.address,
    constructorArguments: [verifier.address, hasher.address, levels],
  })

  console.log('Verification successful!')
}

export default deployContracts
deployContracts.tags = ['all', 'deploy']
