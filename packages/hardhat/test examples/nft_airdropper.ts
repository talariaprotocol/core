import { hexlify, toBeHex, toBigInt, ZeroAddress, zeroPadValue } from 'ethers'
import {
  generateTransfer,
  getRandomRecipient,
  pedersenHash,
  stringifyBigInts,
  toFixedHex,
} from '../helpers/helpers'

export const websnarkUtils = require('websnark/src/utils')
export const buildGroth16 = require('websnark/src/groth16')

import {
  GiftCards,
  GiftCards__factory,
  Hasher,
  Hasher__factory,
  Verifier,
  Verifier__factory,
  TestValidatorModule,
  TestValidatorModule__factory,
  BCN__factory,
  BCN,
  WorldChampionNFT__factory,
  WorldChampionNFT,
  WorldChampionNFTAirdropper__factory,
  WorldChampionNFTAirdropper,
} from '../typechain-types'

const fs = require('fs')
const path = require('path')

const { expect } = require('chai')
const { ethers } = require('hardhat')

const MerkleTree = require('fixed-merkle-tree')

describe('Airdropper', function () {
  let Verifier: Verifier__factory, verifier: Verifier
  let Hasher: Hasher__factory, hasher: Hasher
  let WorldChampionAirdropper: WorldChampionNFTAirdropper__factory,
    worldChampionAirdropper: WorldChampionNFTAirdropper
  let TestValidatorModule: TestValidatorModule__factory, testValidatorModule: TestValidatorModule
  let WorldChampionNFT: WorldChampionNFT__factory, worldChampionNFT: WorldChampionNFT
  let owner: any, addr1: any, addr2: any

  let tree: any
  let groth16: any
  const levels = 20
  let circuit: any
  let proving_key: any

  before(async function () {
    // Required variables
    tree = new MerkleTree(levels)
    groth16 = await buildGroth16()
    circuit = require('../helpers/withdraw.json')
    const provingKeyPath = path.resolve(__dirname, '../helpers/withdraw_proving_key.bin')
    proving_key = fs.readFileSync(provingKeyPath).buffer
    ;[owner, addr1, addr2] = await ethers.getSigners()

    Verifier = await ethers.getContractFactory('Verifier')
    verifier = await Verifier.deploy()

    Hasher = await ethers.getContractFactory('Hasher')
    hasher = await Hasher.deploy()

    WorldChampionNFT = (await ethers.getContractFactory('WorldChampionNFT')) as WorldChampionNFT__factory
    worldChampionNFT = (await WorldChampionNFT.deploy(owner)) as WorldChampionNFT

    // Send some tokens to the owner
    await worldChampionNFT.safeMint(await owner.getAddress(), 1, '')

    WorldChampionAirdropper = await ethers.getContractFactory('WorldChampionNFTAirdropper')
    worldChampionAirdropper = await WorldChampionAirdropper.deploy(
      await verifier.getAddress(), // verifier
      await hasher.getAddress(), // hasher
      levels, // merkle tree height
      await worldChampionNFT.getAddress(), // assuming a dummy token for simplicity
    )

    TestValidatorModule = await ethers.getContractFactory('TestValidatorModule')
    testValidatorModule = await TestValidatorModule.deploy()
    ;[owner, addr1, addr2] = await ethers.getSigners()
  })

  it('Should correctly consume a gift card', async function () {
    // Generate pedersen hashes and add to the tree
    const transfer = generateTransfer()
    tree.insert(transfer.commitment)
    let recipient = getRandomRecipient()

    const initialBalance = await worldChampionNFT.balanceOf(await owner.getAddress())

    console.log('approving')
    // Approve worldChampionNFT to spend on behalf of the owner
    await worldChampionNFT.connect(owner).approve(await worldChampionAirdropper.getAddress(), 1)

    console.log('approval', await worldChampionNFT.getApproved(1))
    console.log('owner', await owner.getAddress())
    console.log('worldChampionAirdropper', await worldChampionAirdropper.getAddress())

    console.log('gifts balance', await worldChampionNFT.balanceOf(await worldChampionAirdropper.getAddress()))
    console.log('owner balance', await worldChampionNFT.balanceOf(await owner.getAddress()))
    // Create gift card with test validator module
    await expect(
      worldChampionAirdropper.connect(owner).createWorldChampionNFTAirdrop(transfer.commitment, [], 1, 1),
    ).to.emit(worldChampionAirdropper, 'NewCode')

    console.log('gifts balance', await worldChampionNFT.balanceOf(await worldChampionAirdropper.getAddress()))
    console.log('owner balance', await worldChampionNFT.balanceOf(await owner.getAddress()))

    // Create parameters for the consumption
    const { pathElements, pathIndices } = tree.path(Number(await worldChampionAirdropper.nextIndex()) - 1)
    const input = stringifyBigInts({
      // public
      root: tree.root(),
      nullifierHash: pedersenHash(transfer.nullifier.leInt2Buff(31)),
      relayer: ZeroAddress,
      recipient: await owner.getAddress(),
      fee: 0,
      refund: 0,

      // private
      nullifier: transfer.nullifier,
      secret: transfer.secret,
      pathElements: pathElements,
      pathIndices: pathIndices,
    })

    const proofData = await websnarkUtils.genWitnessAndProve(groth16, input, circuit, proving_key)
    const { proof } = websnarkUtils.toSolidityInput(proofData)

    const root = zeroPadValue(toBeHex(input.root), 32)
    const nullifierHash = zeroPadValue(toBeHex(input.nullifierHash), 32)

    // Execute the test function!
    await expect(
      worldChampionAirdropper.consumeWorldChampionNFTAirdrop(
        transfer.commitment,
        proof,
        root,
        nullifierHash,
        await owner.getAddress(),
        ['0x'],
      ),
    ).to.emit(worldChampionAirdropper, 'Success')
  })
})
