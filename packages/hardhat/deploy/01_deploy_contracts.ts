import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { run } from 'hardhat'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

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
  })

  const hasher = await deploy('Hasher', {
    from: deployer,
    log: true,
  })

  const levels = 20 // Merkle tree height
  const earlyAccessCodes = await deploy('EarlyAccessCodes', {
    from: deployer,
    args: [verifier.address, hasher.address, levels],
    log: true,
  })

  const earlyAccessCodesTestContract = await deploy('EarlyAccessCodesTestContract', {
    from: deployer,
    args: [earlyAccessCodes.address],
    log: true,
  })

  const numberContract = await deploy('NumberContract', {
    from: deployer,
    args: [earlyAccessCodes.address],
    log: true,
  })

  const USDConOptimismSepolia = "0x5fd84259d66Cd46123540766Be93DFE6D43130D7"
  const giftCardsContract = await deploy('GiftCards', {
    from: deployer,
    args: [verifier.address, hasher.address, levels, USDConOptimismSepolia],
    log: true,
  })

  const poapAddress = "0x22C1f6050E56d2876009903609a2cC3fEf83B415";
  const poapAirdropperContract = await deploy('POAPAirdropper', {
    from: deployer,
    args: [verifier.address, hasher.address, levels, poapAddress],
    log: true,
  })

  const testValidatorModule = await deploy('TestValidatorModule', {
    from: deployer,
    log: true,
  })

  const worldcoinValidatorModule = await deploy('WorldcoinValidatorModule', {
    from: deployer,
    log: true,
  })

  // Save addresses
  addresses[network.name] = {
    Verifier: verifier.address,
    Hasher: hasher.address,
    EarlyAccessCodes: earlyAccessCodes.address,
    EarlyAccessCodesTestContract: earlyAccessCodesTestContract.address,
    NumberContract: numberContract.address,
    GiftCards: giftCardsContract.address,
    POAPAirdropper: poapAirdropperContract.address,
    TestValidatorModule: testValidatorModule.address,
    WorldcoinValidatorModule: worldcoinValidatorModule.address,
  }

  // Write updated addresses back to the JSON file
  writeFileSync(addressesFilePath, JSON.stringify(addresses, null, 2))

  // Verify Contracts
  console.log('Verifying contracts...')
  try {
    run('verify:verify', {
      address: verifier.address,
      contract: 'contracts/helpers/Verifier.sol:Verifier', // Optional, only needed if not the default contract
    })

    await run('verify:verify', {
      address: hasher.address,
      contract: 'contracts/helpers/Hasher.sol:Hasher',
    })

    await run('verify:verify', {
      address: earlyAccessCodes.address,
      contract: 'contracts/useCases/EarlyAccessCodes.sol:EarlyAccessCodes',
      constructorArguments: [verifier.address, hasher.address, 20],
    })

    await run('verify:verify', {
      address: earlyAccessCodesTestContract.address,
      contract: 'contracts/useCases/EarlyAccessCodesTestContract.sol:EarlyAccessCodesTestContract',
      constructorArguments: [earlyAccessCodes.address],
    })

    await run('verify:verify', {
      address: numberContract.address,
      contract: 'contracts/useCases/NumberContract.sol:NumberContract',
      constructorArguments: [earlyAccessCodes.address],
    })

    await run('verify:verify', {
      address: giftCardsContract.address,
      contract: 'contracts/useCases/GiftCards.sol:GiftCards',
      constructorArguments: [verifier.address, hasher.address, 20, USDConOptimismSepolia],
    })

    await run('verify:verify', {
      address: poapAirdropperContract.address,
      contract: 'contracts/useCases/POAPAirdropper.sol:POAPAirdropper',
      constructorArguments: [verifier.address, hasher.address, 20, poapAddress],
    })

    await run('verify:verify', {
      address: testValidatorModule.address,
      contract: 'contracts/modules/TestValidatorModule.sol:TestValidatorModule',
    })

    await run('verify:verify', {
      address: worldcoinValidatorModule.address,
      contract: 'contracts/modules/WorldcoinValidatorModule.sol:WorldcoinValidatorModule',
    })

    console.log('Verification successful!')
  } catch (error) {
    console.error('Verification failed:', error)
  }
}

export default deployContracts
deployContracts.tags = ['all', 'deploy']
