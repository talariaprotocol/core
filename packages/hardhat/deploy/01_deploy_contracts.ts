import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { run } from 'hardhat'

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

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

  const testValidatorModule = await deploy('TestValidatorModule', {
    from: deployer,
    log: true,
  })

  const worldcoinValidatorModule = await deploy('WorldcoinValidatorModule', {
    from: deployer,
    log: true,
  })

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
