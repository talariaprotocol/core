import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

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

  await deploy('EarlyAccessCodesTestContract', {
    from: deployer,
    args: [earlyAccessCodes.address],
    log: true,
  })

  await deploy('TestValidatorModule', {
    from: deployer,
    log: true,
  })

  await deploy('WorldcoinValidatorModule', {
    from: deployer,
    log: true,
  })
}

export default deployContracts
deployContracts.tags = ['all', 'deploy']
