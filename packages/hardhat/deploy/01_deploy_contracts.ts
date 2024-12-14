import { readFileSync, writeFileSync } from 'fs'
import { run } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import path from 'path'

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  console.log('Deploying contracts on network:', network.name)

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

  const usdc = await deploy('USDC', {
    from: deployer,
    log: true,
    args: [deployer],
    skipIfAlreadyDeployed: false,
  })

  const lendingProtocol = await deploy('LendingProtocol', {
    from: deployer,
    log: true,
    args: [deployer, deployer, usdc.address],
    skipIfAlreadyDeployed: false,
  })

  // Save addresses
  addresses[network.name] = {
    ...addresses[network.name],
    usdc: usdc.address,
    lendingProtocol: lendingProtocol.address,
  }

  // Write updated addresses back to the JSON file
  writeFileSync(addressesFilePath, JSON.stringify(addresses, null, 2))

  // Verify Contracts
  console.log('Verifying contracts...')

  await run('verify:verify', {
    address: lendingProtocol.address,
    constructorArguments: [deployer, deployer, usdc.address],
  })

  await run('verify:verify', {
    address: usdc.address,
    constructorArguments: [deployer],
  })

  console.log('Verification successful!')
}

export default deployContracts
deployContracts.tags = ['all', 'deploy']
