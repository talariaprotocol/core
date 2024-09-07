import { join } from 'path'

import { NFTStorage } from 'nft.storage'
import { WorldChampionNFT, WorldChampionNFT__factory, BCN, BCN__factory, MatchTicket__factory, MatchTicket } from '../typechain-types'
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

  // Send Match Tickets
  const MatchTicketContract = (await hre.ethers.getContractFactory('MatchTicket')) as MatchTicket__factory
  const MatchTicket = MatchTicketContract.attach(addresses[network.name].MatchTicket) as MatchTicket

  console.log('Sending Match Tickets...')
  await MatchTicket.mint(leboAddress, 1, 10, '0x');
  await MatchTicket.mint(fainsteinAddress, 2, 10, '0x');
  await MatchTicket.mint(martinAddress, 3, 10, '0x');
  await MatchTicket.mint(leboAddress, 4, 10, '0x');
  await MatchTicket.mint(fainsteinAddress, 5, 10, '0x');
  await MatchTicket.mint(martinAddress, 6, 10, '0x');
  console.log('Match Tickets sent!')

  // Send some tokens to initial owners
  const BCNContract = (await hre.ethers.getContractFactory('BCN')) as BCN__factory
  const BCN = BCNContract.attach(addresses[network.name].BCN) as BCN

  console.log('Transferring tokens to initial owners...')
  await BCN.transfer(leboAddress, hre.ethers.parseEther('100'))
  await BCN.transfer(fainsteinAddress, hre.ethers.parseEther('100'))
  await BCN.transfer(martinAddress, hre.ethers.parseEther('100'))
  console.log('Tokens transferred!')

  // Mint some NFTs
  const WorldChampionNFTContract = (await hre.ethers.getContractFactory(
    'WorldChampionNFT',
  )) as WorldChampionNFT__factory
  const worldChampionNFT = WorldChampionNFTContract.attach(
    addresses[network.name].WorldChampionNFT,
  ) as WorldChampionNFT

  console.log('Minting NFTs...')
  const folder = 'https://ipfs.io/ipfs/Qmacc3iJq3uarS9bp8uDz36gHthp9VW833FaYApST9erMn'
  await worldChampionNFT.safeMint(leboAddress, 10, folder + '/0.json')
  await worldChampionNFT.safeMint(fainsteinAddress, 11, folder + '/1.json')
  await worldChampionNFT.safeMint(martinAddress, 12, folder + '/2.json')
  await worldChampionNFT.safeMint(leboAddress, 13, folder + '/3.json')
  await worldChampionNFT.safeMint(fainsteinAddress, 14, folder + '/4.json')
  await worldChampionNFT.safeMint(martinAddress, 15, folder + '/5.json')

  console.log('NFTs minted!')
}

uploadAndMint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
