import { join } from 'path'

import { NFTStorage } from 'nft.storage'
import { AlephNFT, AlephNFT__factory, MORFI, MORFI__factory } from '../typechain-types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

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
  const { ethers, network } = hre

  const leboAddress = '0xdFD699a3224899b601925A4ce7D34c6F51b337EC'
  const fainsteinAddress = '0x9d901B7394Cb5902ff4c4770E8D1148Bf3D025ee'
  const martinAddress = '0xEB71ed911e4dFc35Da80103a72fE983C8c709F33'

  console.log('Uploading metadata and minting NFTs...')

  // Send some tokens to initial owners
  const MORFIContract = (await hre.ethers.getContractFactory('MORFI')) as MORFI__factory
  const MORFI = MORFIContract.attach(addresses[network.name].MORFI) as MORFI

  console.log('Transferring tokens to initial owners...')
  await MORFI.transfer(leboAddress, hre.ethers.parseEther('100'))
  await MORFI.transfer(fainsteinAddress, hre.ethers.parseEther('100'))
  await MORFI.transfer(martinAddress, hre.ethers.parseEther('100'))
  console.log('Tokens transferred!')


  // Mint some NFTs
  const AlephNFTContract = (await hre.ethers.getContractFactory('AlephNFT')) as AlephNFT__factory
  const alephNFT = AlephNFTContract.attach(addresses[network.name].AlephNFT) as AlephNFT

  console.log('Minting NFTs...')
  const folder = "https://ipfs.io/ipfs/QmYY1DAVEFT442CeuBi7Rid1e3pumNhZmXJ6JdRd7uJosU"
  await alephNFT.safeMint(leboAddress, 10, folder + "/0.json")
  await alephNFT.safeMint(fainsteinAddress, 11, folder + "/1.json")
  await alephNFT.safeMint(martinAddress, 12, folder + "/2.json")
  await alephNFT.safeMint(leboAddress, 13, folder + "/3.json")
  await alephNFT.safeMint(fainsteinAddress, 14, folder + "/4.json")
  await alephNFT.safeMint(martinAddress, 15, folder + "/5.json")

  console.log('NFTs minted!')
}

uploadAndMint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
