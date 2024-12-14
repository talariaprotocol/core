import { join } from 'path'

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { NFTStorage } from 'nft.storage'
import { USDC, USDC__factory } from '../typechain-types'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
require('dotenv').config({ path: join(__dirname, '../../.env') })

const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_TOKEN

if (NFT_STORAGE_TOKEN == null) throw new Error('Missing NFT_STORAGE_TOKEN')

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

export const uploadMetadata = async (json: any): Promise<string> => {
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
  const URI = await client.storeBlob(blob)

  console.log('Uploaded metadata to IPFS:', URI)

  return URI
}

// Read addresses from deployments/addresses.json
const addresses = require('../deployments/addresses.json')
const metadata: any[] = require('./metadata.json')

// Read metadata array from metadata.json and upload each one and mint NFT
async function uploadAndMint() {
  const hre = require('hardhat') as HardhatRuntimeEnvironment
  const { ethers, network, deployer } = hre

  const leboAddress = '0xdFD699a3224899b601925A4ce7D34c6F51b337EC'
  const fainsteinAddress =
    network.name == 'kinto'
      ? '0x7D5000079419D3811033dd57C76a0E77924AB9A8'
      : '0x9d901B7394Cb5902ff4c4770E8D1148Bf3D025ee'
  const martinAddress =
    network.name == 'kinto'
      ? '0x66C8F1182B6cd92dbA95Fa7D18A303e2fef8686f'
      : '0xEB71ed911e4dFc35Da80103a72fE983C8c709F33'

  console.log('Uploading metadata and minting NFTs...')

  // Send some tokens to initial owners
  const USDCContract = (await hre.ethers.getContractFactory('USDC')) as USDC__factory
  const USDC = USDCContract.attach(addresses[network.name].USDC) as USDC

  console.log('Transferring tokens to initial owners...')
  await USDC.transfer(leboAddress, hre.ethers.parseEther('100'))
  await USDC.transfer(fainsteinAddress, hre.ethers.parseEther('100'))
  await USDC.transfer(martinAddress, hre.ethers.parseEther('100'))
  console.log('Tokens transferred!')
}

uploadAndMint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
