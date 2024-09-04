import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ethers, run } from 'hardhat'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { WorldChampionNFT, WorldChampionNFT__factory, BCN, BCN__factory } from '../typechain-types'

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
  const earlyAccessCodes = await deploy('EarlyAccessCodes', {
    from: deployer,
    args: [verifier.address, hasher.address, levels],
    log: true,
    skipIfAlreadyDeployed: false,
  })

  const earlyAccessCodesTestContract = await deploy('EarlyAccessCodesTestContract', {
    from: deployer,
    args: [earlyAccessCodes.address],
    log: true,
    skipIfAlreadyDeployed: false,
  })

  const numberContract = await deploy('NumberContract', {
    from: deployer,
    args: [earlyAccessCodes.address],
    log: true,
    skipIfAlreadyDeployed: false,
  })

  const BCN = await deploy('BCN', {
    from: deployer,
    log: true,
    args: [deployer],
    skipIfAlreadyDeployed: false,
  })

  const WorldChampionNFT = await deploy('WorldChampionNFT', {
    from: deployer,
    log: true,
    args: [deployer],
    skipIfAlreadyDeployed: false,
  })

  const MatchTicket = await deploy('MatchTicket', {
    from: deployer,
    log: true,
    args: [deployer],
    skipIfAlreadyDeployed: false,
  })

  const giftCardsContract = await deploy('GiftCards', {
    from: deployer,
    args: [verifier.address, hasher.address, levels, BCN.address],
    log: true,
    skipIfAlreadyDeployed: false,
  })

  const WorldChampionNFTAirdropperContract = await deploy('WorldChampionNFTAirdropper', {
    from: deployer,
    args: [verifier.address, hasher.address, levels, WorldChampionNFT.address],
    log: true,
    skipIfAlreadyDeployed: false,
  })

  const MatchTicketAirdropper = await deploy('MatchTicketAirdropper', {
    from: deployer,
    args: [verifier.address, hasher.address, levels, MatchTicket.address],
    log: true,
    skipIfAlreadyDeployed: false,
  })

  const testValidatorModule = await deploy('TestValidatorModule', {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: false,
  })

  const worldcoinValidatorModule = await deploy('WorldcoinValidatorModule', {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: false,
  })

  const kintoCountryValidatorModule = await deploy('KintoCountryValidatorModule', {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: false,
  })

  // Done using https://tools.privado.id/query-builder
  // const privadoIDQuery = {
  //   "circuitId": "credentialAtomicQuerySigV2OnChain",
  //   "id": 1724520004n,
  //   "query": {
  //     "allowedIssuers": [
  //       "*"
  //     ],
  //     "context": "ipfs://QmXg98gx2r421aHA9ZLJXnrLnorz1sM6p2m4yZfRAYMhob",
  //     "type": "Cak3Role",
  //     "skipClaimRevocationCheck": true,
  //     "credentialSubject": {
  //       "role": {
  //         "$eq": "investor"
  //       }
  //     }
  //   }
  // }

  const privadoIDQuery = {
    schema: 1,
    slotIndex: 1,
    operator: 1,
    value: [],
    circuitId: '',
  }

  const privadoIdValidatorModule = await deploy('PrivadoIDValidatorModule', {
    from: deployer,
    args: [privadoIDQuery],
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
    BCN: BCN.address,
    WorldChampionNFT: WorldChampionNFT.address,
    MatchTicket: MatchTicket.address,
    WorldChampionNFTAirdropper: WorldChampionNFTAirdropperContract.address,
    MatchTicketAirdropper: MatchTicketAirdropper.address,
    TestValidatorModule: testValidatorModule.address,
    WorldcoinValidatorModule: worldcoinValidatorModule.address,
    KintoCountryValidatorModule: kintoCountryValidatorModule.address,
    PrivadoIDValidatorModule: privadoIdValidatorModule.address,
  }

  // Write updated addresses back to the JSON file
  writeFileSync(addressesFilePath, JSON.stringify(addresses, null, 2))

  // Verify Contracts
  console.log('Verifying contracts...')
  try {
    await run('verify:verify', {
      address: verifier.address,
      contract: 'contracts/helpers/Verifier.sol:Verifier', // Optional, only needed if not the default contract
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }
  try {
    await run('verify:verify', {
      address: hasher.address,
      contract: 'contracts/helpers/Hasher.sol:Hasher',
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }
  try {
    await run('verify:verify', {
      address: earlyAccessCodes.address,
      contract: 'contracts/useCases/EarlyAccessCodes.sol:EarlyAccessCodes',
      constructorArguments: [verifier.address, hasher.address, 20],
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }
  try {
    await run('verify:verify', {
      address: earlyAccessCodesTestContract.address,
      contract: 'contracts/useCases/EarlyAccessCodesTestContract.sol:EarlyAccessCodesTestContract',
      constructorArguments: [earlyAccessCodes.address],
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }
  try {
    await run('verify:verify', {
      address: numberContract.address,
      contract: 'contracts/useCases/NumberContract.sol:NumberContract',
      constructorArguments: [earlyAccessCodes.address],
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }
  try {
    await run('verify:verify', {
      address: BCN.address,
      contract: 'contracts/useCases/BCN.sol:BCN',
      constructorArguments: [deployer],
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }
  try {
    await run('verify:verify', {
      address: WorldChampionNFT.address,
      contract: 'contracts/useCases/WorldChampionNFT.sol:WorldChampionNFT',
      constructorArguments: [deployer],
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }
  try {
    await run('verify:verify', {
      address: MatchTicket.address,
      contract: 'contracts/useCases/MatchTicket.sol:MatchTicket',
      constructorArguments: [deployer],
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }

  try {
    await run('verify:verify', {
      address: giftCardsContract.address,
      contract: 'contracts/useCases/GiftCards.sol:GiftCards',
      constructorArguments: [verifier.address, hasher.address, 20, BCN.address],
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }
  try {
    await run('verify:verify', {
      address: WorldChampionNFTAirdropperContract.address,
      contract: 'contracts/useCases/WorldChampionNFTAirdropper.sol:WorldChampionNFTAirdropper',
      constructorArguments: [verifier.address, hasher.address, 20, WorldChampionNFT.address],
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }
  try {
    await run('verify:verify', {
      address: MatchTicketAirdropper.address,
      contract: 'contracts/useCases/MatchTicketAirdropper.sol:MatchTicketAirdropper',
      constructorArguments: [verifier.address, hasher.address, 20, MatchTicket.address],
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }

  try {
    await run('verify:verify', {
      address: testValidatorModule.address,
      contract: 'contracts/modules/TestValidatorModule.sol:TestValidatorModule',
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }
  try {
    await run('verify:verify', {
      address: worldcoinValidatorModule.address,
      contract: 'contracts/modules/WorldcoinValidatorModule.sol:WorldcoinValidatorModule',
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }

  try {
    await run('verify:verify', {
      address: kintoCountryValidatorModule.address,
      contract: 'contracts/modules/KintoCountryValidatorModule.sol:KintoCountryValidatorModule',
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }

  try {
    await run('verify:verify', {
      address: privadoIdValidatorModule.address,
      constructorArguments: [privadoIDQuery],
      contract: 'contracts/modules/PrivadoIDValidatorModule.sol:PrivadoIDValidatorModule',
    })
  } catch (error) {
    console.error('Verifier verification failed:', error)
  }

  console.log('Verification successful!')
}

export default deployContracts
deployContracts.tags = ['all', 'deploy']
