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
} from '../typechain-types'

const fs = require('fs')
const path = require('path')

const { expect } = require('chai')
const { ethers } = require('hardhat')

const MerkleTree = require('fixed-merkle-tree')

describe('GiftCards', function () {
  let Verifier: Verifier__factory, verifier: Verifier
  let Hasher: Hasher__factory, hasher: Hasher
  let GiftCards: GiftCards__factory, giftCards: GiftCards
  let TestValidatorModule: TestValidatorModule__factory, testValidatorModule: TestValidatorModule
  let Morfi: BCN__factory, bcn: BCN
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

    Morfi = (await ethers.getContractFactory('BCN')) as BCN__factory
    bcn = (await Morfi.deploy(owner)) as BCN

    // Send some tokens to the owner
    await bcn.mint(await owner.getAddress(), 1000)

    GiftCards = await ethers.getContractFactory('GiftCards')
    giftCards = await GiftCards.deploy(
      await verifier.getAddress(), // verifier
      await hasher.getAddress(), // hasher
      levels, // merkle tree height
      await bcn.getAddress(), // assuming a dummy token for simplicity
    )

    TestValidatorModule = await ethers.getContractFactory('TestValidatorModule')
    testValidatorModule = await TestValidatorModule.deploy()
    ;[owner, addr1, addr2] = await ethers.getSigners()
  })

  it.only('Should correctly consume a gift card', async function () {
    // Generate pedersen hashes and add to the tree
    const transfer = generateTransfer()
    tree.insert(transfer.commitment)
    let recipient = getRandomRecipient()

    const initialBalance = await bcn.balanceOf(await owner.getAddress())

    console.log('approving')
    // Approve bcn to spend on behalf of the owner
    await bcn.connect(owner).approve(await giftCards.getAddress(), 1000)

    console.log('approval', await bcn.allowance(await owner.getAddress(), await giftCards.getAddress()))
    console.log('owner', await owner.getAddress())
    console.log('giftCards', await giftCards.getAddress())

    console.log('gifts balance', await bcn.balanceOf(await giftCards.getAddress()))
    console.log('owner balance', await bcn.balanceOf(await owner.getAddress()))
    // Create gift card with test validator module
    await expect(
      giftCards.connect(owner).createGiftCard(transfer.commitment, [], 100, 'Gift Card Metadata'),
    ).to.emit(giftCards, 'NewCode')

    console.log('gifts balance', await bcn.balanceOf(await giftCards.getAddress()))
    console.log('owner balance', await bcn.balanceOf(await owner.getAddress()))

    // Create parameters for the consumption
    const { pathElements, pathIndices } = tree.path(Number(await giftCards.nextIndex()) - 1)
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
    
    // Check Proof
    expect(
      await verifier.verifyProof(proof, [
        BigInt(root),
        BigInt(nullifierHash),
        BigInt(await owner.getAddress()),
        0,
        0,
        0,
      ]),
    ).to.be.true

    // Execute the test function!
    await expect(
      giftCards.consumeGiftCard(transfer.commitment, proof, root, nullifierHash, await owner.getAddress(), [
        '0x',
      ]),
    ).to.emit(giftCards, 'Success')
  })
})
