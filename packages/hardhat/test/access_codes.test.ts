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
  EarlyAccessCodes,
  EarlyAccessCodes__factory,
  EarlyAccessCodesTestContract,
  EarlyAccessCodesTestContract__factory,
  Hasher,
  Hasher__factory,
  TestValidatorModule,
  TestValidatorModule__factory,
  Verifier,
  Verifier__factory,
} from '../typechain-types'

const fs = require('fs')
const path = require('path')

const { expect } = require('chai')
const { ethers } = require('hardhat')

const MerkleTree = require('fixed-merkle-tree')

describe('EarlyAccessCodes', function () {
  let Verifier: Verifier__factory, verifier: Verifier
  let Hasher: Hasher__factory, hasher: Hasher
  let EarlyAccessCodes: EarlyAccessCodes__factory,
    earlyAccessCodes: EarlyAccessCodes,
    EarlyAccessCodesTestContract: EarlyAccessCodesTestContract__factory,
    earlyAccessCodesTestContract: EarlyAccessCodesTestContract

  let TestValidatorModule: TestValidatorModule__factory, testValidatorModule: TestValidatorModule

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

    EarlyAccessCodes = await ethers.getContractFactory('EarlyAccessCodes')
    earlyAccessCodes = await EarlyAccessCodes.deploy(
      await verifier.getAddress(), // verifier
      await hasher.getAddress(), // hasher
      levels, // merkle tree height
    )

    EarlyAccessCodesTestContract = await ethers.getContractFactory('EarlyAccessCodesTestContract')
    earlyAccessCodesTestContract = await EarlyAccessCodesTestContract.deploy(
      await earlyAccessCodes.getAddress(),
    )

    TestValidatorModule = await ethers.getContractFactory('TestValidatorModule')
    testValidatorModule = await TestValidatorModule.deploy()

    ;[owner, addr1, addr2] = await ethers.getSigners()
  })

  it('Debe permitir crear un código', async function () {
    const transfer = generateTransfer()

    const commitment = transfer.commitment

    await expect(earlyAccessCodes.createEarlyAccessCode(commitment, [])).to.emit(earlyAccessCodes, 'NewCode')

    expect(await earlyAccessCodes.commitments(commitment)).to.be.true
  })

  it('Debe evitar crear un código duplicado', async function () {
    const transfer = generateTransfer()

    const commitment = transfer.commitment
    await earlyAccessCodes.createEarlyAccessCode(commitment, [])

    await expect(earlyAccessCodes.createEarlyAccessCode(commitment, [])).to.be.revertedWith(
      'The commitment has been submitted',
    )
  })

  it.only('Debe consumir un código correctamente', async function () {
    // Generate pedersen hashes and add to the tree
    const transfer = generateTransfer()
    tree.insert(transfer.commitment)
    let recipient = getRandomRecipient()

    // Create Code with test validator module
    await expect(earlyAccessCodes.connect(owner).createEarlyAccessCode(transfer.commitment, [
      await testValidatorModule.getAddress()
    ])).to.emit(
      earlyAccessCodes,
      'NewCode',
    )

    // Create parameters for the consumption
    const { pathElements, pathIndices } = tree.path(0)
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
      earlyAccessCodesTestContract.connect(owner).testFunction(transfer.commitment, proof, root, nullifierHash, ["0x"]),
    ).to.emit(earlyAccessCodesTestContract, 'Success')
  })
})

// Gift Cards Test
