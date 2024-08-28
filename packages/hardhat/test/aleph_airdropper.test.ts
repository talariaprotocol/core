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
  MORFI__factory,
  MORFI,
  AlephNFT__factory,
  AlephNFT,
  AlephNFTAirdropper__factory,
  AlephNFTAirdropper,
} from '../typechain-types'

const fs = require('fs')
const path = require('path')

const { expect } = require('chai')
const { ethers } = require('hardhat')

const MerkleTree = require('fixed-merkle-tree')

describe('Airdropper', function () {
  let Verifier: Verifier__factory, verifier: Verifier
  let Hasher: Hasher__factory, hasher: Hasher
  let AlephAirdropper: AlephNFTAirdropper__factory, alephAirdropper: AlephNFTAirdropper
  let TestValidatorModule: TestValidatorModule__factory, testValidatorModule: TestValidatorModule
  let AlephNFT: AlephNFT__factory, alephNFT: AlephNFT
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

    AlephNFT = (await ethers.getContractFactory('AlephNFT')) as AlephNFT__factory
    alephNFT = (await AlephNFT.deploy(owner)) as AlephNFT

    // Send some tokens to the owner
    await alephNFT.safeMint(await owner.getAddress(), 1, '')

    AlephAirdropper = await ethers.getContractFactory('AlephNFTAirdropper')
    alephAirdropper = await AlephAirdropper.deploy(
      await verifier.getAddress(), // verifier
      await hasher.getAddress(), // hasher
      levels, // merkle tree height
      await alephNFT.getAddress(), // assuming a dummy token for simplicity
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

    const initialBalance = await alephNFT.balanceOf(await owner.getAddress())

    console.log('approving')
    // Approve alephNFT to spend on behalf of the owner
    await alephNFT.connect(owner).approve(await alephAirdropper.getAddress(), 1)

    console.log('approval', await alephNFT.getApproved(1))
    console.log('owner', await owner.getAddress())
    console.log('alephAirdropper', await alephAirdropper.getAddress())

    console.log('gifts balance', await alephNFT.balanceOf(await alephAirdropper.getAddress()))
    console.log('owner balance', await alephNFT.balanceOf(await owner.getAddress()))
    // Create gift card with test validator module
    await expect(alephAirdropper.connect(owner).createAlephNFTAirdrop(transfer.commitment, [], 1, 1)).to.emit(
      alephAirdropper,
      'NewCode',
    )

    console.log('gifts balance', await alephNFT.balanceOf(await alephAirdropper.getAddress()))
    console.log('owner balance', await alephNFT.balanceOf(await owner.getAddress()))

    // Create parameters for the consumption
    const { pathElements, pathIndices } = tree.path(Number(await alephAirdropper.nextIndex()) - 1)
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
      alephAirdropper.consumeAlephNFTAirdrop(
        transfer.commitment,
        proof,
        root,
        nullifierHash,
        await owner.getAddress(),
        ['0x'],
      ),
    ).to.emit(alephAirdropper, 'Success')
  })
})
