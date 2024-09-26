import { Contract, ContractFactory, hexlify, toBeHex, toBigInt, ZeroAddress, zeroPadValue } from 'ethers'
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
  AddressFreeBridge,
  AddressFreeBridge__factory,
  Hasher,
  Hasher__factory,
  Verifier,
  Verifier__factory,
  TestValidatorModule,
  TestValidatorModule__factory,
  BCN__factory,
  BCN,
  EndpointV2Mock__factory,
  EndpointV2Mock,
} from '../typechain-types'

const fs = require('fs')
const path = require('path')

const { expect } = require('chai')
import { ethers } from 'hardhat'
import { Options } from '@layerzerolabs/lz-v2-utilities'

const MerkleTree = require('fixed-merkle-tree')

describe('Bridge', function () {
  let Verifier: Verifier__factory, verifier: Verifier
  let Hasher: Hasher__factory, hasher: Hasher
  let Bridge: AddressFreeBridge__factory, bridgeA: AddressFreeBridge, bridgeB: AddressFreeBridge
  let TestValidatorModule: TestValidatorModule__factory, testValidatorModule: TestValidatorModule
  let Morfi: BCN__factory, bcn: BCN
  let owner: any, addr1: any, addr2: any

  let EndpointV2Mock: EndpointV2Mock__factory
  let mockEndpointA: EndpointV2Mock, mockEndpointB: EndpointV2Mock

  let tree: any
  let groth16: any
  const levels = 20
  let circuit: any
  let proving_key: any
  const testEid1 = 1,
    testEid2 = 2

  before(async function () {
    // Required variables
    tree = new MerkleTree(levels)
    groth16 = await buildGroth16()
    circuit = require('../helpers/withdraw.json')
    const provingKeyPath = path.resolve(__dirname, '../helpers/withdraw_proving_key.bin')
    proving_key = fs.readFileSync(provingKeyPath).buffer
    ;[owner, addr1, addr2] = await ethers.getSigners()

    console.log("Owner's address: ", await owner.getAddress())
    console.log("User Addr1's address: ", await addr1.getAddress())
    console.log("User Addr2's address: ", await addr2.getAddress())

    Verifier = await ethers.getContractFactory('Verifier')
    verifier = await Verifier.deploy()

    Hasher = await ethers.getContractFactory('Hasher')
    hasher = await Hasher.deploy()

    // LayerZero Mocks

    EndpointV2Mock = await ethers.getContractFactory('EndpointV2Mock')
    mockEndpointA = await EndpointV2Mock.deploy(testEid1)
    mockEndpointB = await EndpointV2Mock.deploy(testEid2)

    Bridge = await ethers.getContractFactory('AddressFreeBridge')
    bridgeA = await Bridge.deploy(
      await verifier.getAddress(), // verifier
      await hasher.getAddress(), // hasher
      levels, // merkle tree height
      await mockEndpointA.getAddress(), // endpoint
      owner,
    )
    bridgeB = await Bridge.deploy(
      await verifier.getAddress(), // verifier
      await hasher.getAddress(), // hasher
      levels, // merkle tree height
      await mockEndpointB.getAddress(), // endpoint
      owner,
    )

    // Transfer funds from owner to the bridges
    await owner.sendTransaction({
      to: await bridgeA.getAddress(),
      value: ethers.parseEther('3.0'),
    })
    await owner.sendTransaction({
      to: await bridgeB.getAddress(),
      value: ethers.parseEther('3.0'),
    })

    // Setting destination endpoints in the LZEndpoint mock for each MyOFT instance
    await mockEndpointA.setDestLzEndpoint(await bridgeB.getAddress(), await mockEndpointB.getAddress())
    await mockEndpointB.setDestLzEndpoint(await bridgeA.getAddress(), await mockEndpointA.getAddress())

    console.log("EndpointA's address: ", await mockEndpointA.getAddress())
    console.log("EndpointB's address: ", await mockEndpointB.getAddress())
    console.log("Bridge A's address: ", await bridgeA.getAddress())
    console.log("Bridge B's address: ", await bridgeB.getAddress())

    console.log('LZEndpointA Lookup', await mockEndpointA.lzEndpointLookup(await bridgeB.getAddress()))
    console.log('LZEndpointB Lookup', await mockEndpointB.lzEndpointLookup(await bridgeA.getAddress()))

    // Setting each MyOFT instance as a peer of the other in the mock LZEndpoint
    await expect(
      bridgeA.connect(owner).setPeer(testEid2, ethers.zeroPadValue(await bridgeB.getAddress(), 32)),
    ).to.emit(bridgeA, 'PeerSet')

    await expect(
      bridgeB.connect(owner).setPeer(testEid1, ethers.zeroPadValue(await bridgeA.getAddress(), 32)),
    ).to.emit(bridgeB, 'PeerSet')

    console.log('Bridge A Peers :', await bridgeA.peers(2))
    console.log('Bridge B Peers :', await bridgeB.peers(1))
    ;[owner, addr1, addr2] = await ethers.getSigners()
  })

  it.only('Should correctly operate a bridge', async function () {
    console.log('\n\n >>>> Staring test <<<< ')

    // Generate pedersen hashes and add to the tree
    const transfer = generateTransfer()
    tree.insert(transfer.commitment)
    let recipient = getRandomRecipient()

    console.log(
      'Owner balance before creating bridge: ',
      await ethers.provider.getBalance(await owner.getAddress()),
    )

    // Create bridge for 0.1 ETH
    await expect(
      bridgeA.connect(owner).createBridge(transfer.commitment, [], 'Gift Card Metadata', {
        value: ethers.parseEther('3'),
      }),
    ).to.emit(bridgeA, 'BridgeCreated')

    console.log(
      'Owner balance after creating bridge: ',
      await ethers.provider.getBalance(await owner.getAddress()),
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

    // Execute the bridge!
    const addr1BalanceBefore = await ethers.provider.getBalance(await addr1.getAddress())
    console.log('Addr1 balance before consuming bridge: ', addr1BalanceBefore)

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

    // First Quote Fee
    const options = Options.newOptions()
      .addExecutorLzReceiveOption(10000000, 129144194680002544n)
      .toHex()
      .toString()
    const returnOptions = Options.newOptions().addExecutorLzReceiveOption(500000, 220).toHex().toString()

    // Fetching the native fee
    const [nativeFee] = await bridgeB.quote(
      // Data for the message to be sent
      transfer.commitment,
      proof,
      root,
      nullifierHash,
      await addr1.getAddress(),
      [],

      // Options for LayerZero execution
      testEid1,
      options,
      returnOptions,
    )

    console.log('Pre-calculated Fee: ', nativeFee * 3n)

    await expect(
      bridgeB.connect(addr1).consumeBridge(
        // Data for the message to be sent
        transfer.commitment,
        proof,
        root,
        nullifierHash,
        await owner.getAddress(),
        ['0x'],

        // Options for LayerZero execution
        testEid1,
        options,
        returnOptions,
        {
          value: BigInt(Number(nativeFee) * 1.05), // a bit more just in case
        },
      ),
    ).to.emit(bridgeB, 'MessageSent')

    console.log('\n\n >>>> Results <<<<')
    console.log(
      'Addr1 balance after consuming bridge: ',
      await ethers.provider.getBalance(await addr1.getAddress()),
    )

    expect(await ethers.provider.getBalance(await addr1.getAddress())).to.be.gt(addr1BalanceBefore)
  })
})
