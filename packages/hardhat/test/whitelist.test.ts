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
  WhitelistFactory,
  WhitelistFactory__factory,
  Hasher,
  Hasher__factory,
  Verifier,
  Verifier__factory,
  Whitelist,
  Whitelist__factory,
  TestProtocol,
} from '../typechain-types'

const fs = require('fs')
const path = require('path')

import { expect } from 'chai'
import { ethers } from 'hardhat'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'

const MerkleTree = require('fixed-merkle-tree')

describe('Whitelist', function () {
  let Verifier: Verifier__factory, verifier: Verifier
  let Hasher: Hasher__factory, hasher: Hasher
  let WhitelistFactoryFactory: WhitelistFactory__factory, whitelistFactory: WhitelistFactory
  let Whitelist: Whitelist__factory, whitelist: Whitelist

  let owner: HardhatEthersSigner, addr1: HardhatEthersSigner, addr2: HardhatEthersSigner, addr3: HardhatEthersSigner

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

    WhitelistFactoryFactory = await ethers.getContractFactory('WhitelistFactory')
    whitelistFactory = await WhitelistFactoryFactory.deploy(
      await verifier.getAddress(),
      await hasher.getAddress(),
      levels,
    )
    ;[owner, addr1, addr2, addr3] = await ethers.getSigners()
  })

  it('Integration test', async function () {
    // Head of marketing (addr1) creates a new whitelist
    const whitelistCreationResp = await whitelistFactory.connect(addr1).create()
    const whitelistReceipt = await whitelistCreationResp.wait()
    const log = whitelistReceipt?.logs.find((log: any) => log.fragment.name === 'WhitelistCreated')
    const whitelistAdd = (log as any)?.args[0]

    const WhitelistFactory = await ethers.getContractFactory('Whitelist')
    whitelist = WhitelistFactory.attach(whitelistAdd).connect(addr1) as Whitelist

    // They have their Protocol
    const TestProtocol = await ethers.getContractFactory('TestProtocol')
    const testProtocol = (await TestProtocol.connect(addr1).deploy(whitelistAdd)) as TestProtocol

    // Generate pedersen hashes and add to the tree
    const transfer = generateTransfer()
    tree.insert(transfer.commitment)
    let recipient = getRandomRecipient()

    // Create Code with test validator module
    await expect(whitelist.connect(addr1).createEarlyAccessCode(transfer.commitment, [])).to.emit(
      whitelist,
      'NewCode',
    )

    // Create parameters for the consumption
    const { pathElements, pathIndices } = tree.path(Number(await whitelist.nextIndex()) - 1)
    const input = stringifyBigInts({
      // public
      root: tree.root(),
      nullifierHash: pedersenHash(transfer.nullifier.leInt2Buff(31)),
      relayer: ZeroAddress,
      recipient: await addr2.getAddress(),
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

    expect(await testProtocol.betaAccessEnabled()).to.equal(true)

    // Execute the test function using addr2 (user)!
    await expect(testProtocol.connect(addr2).test()).to.be.reverted

    // Add addr2 to the whitelist
    await expect(
      whitelist
        .connect(addr2)
        .consumeEarlyAccessCode(
          transfer.commitment,
          proof,
          root,
          nullifierHash,
          await addr2.getAddress(),
          [],
          await addr2.getAddress(),
        ),
    ).to.be.fulfilled

    // Tx 2 should succeed
    await testProtocol.connect(addr2).test()

    // Test turning off beta access
    await expect(testProtocol.connect(addr3).test()).to.be.reverted

    await testProtocol.connect(addr1).setBetaAccessEnabled(false)

    await expect(testProtocol.connect(addr3).test()).to.be.fulfilled
  })
})
