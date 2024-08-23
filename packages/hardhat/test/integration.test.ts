import { generateTransfer } from './helpers/helpers'

const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('EarlyAccessCodes', function () {
  let EarlyAccessCodes,
    earlyAccessCodes: {
      deployed: () => any
      createCode: (arg0: any, arg1: { value: any }) => any
      commitments: (arg0: any) => any
      consumeCode: (arg0: string, arg1: string, arg2: any, arg3: any, arg4: any) => any
      isSpent: (arg0: any) => any
    }
  let Verifier, verifier
  let owner, addr1: { address: any }, addr2
  let hasher

  beforeEach(async function () {
    // Mock del Verifier y hasher
    Verifier = await ethers.getContractFactory('Verifier')
    verifier = await Verifier.deploy()
    await verifier.deployed()

    hasher = await ethers.getContractFactory('hasher')
    hasher = await hasher.deploy()
    await hasher.deployed()

    // Desplegar EarlyAccessCodes
    EarlyAccessCodes = await ethers.getContractFactory('EarlyAccessCodes')
    earlyAccessCodes = await EarlyAccessCodes.deploy(verifier.address, hasher.address, 20)
    await earlyAccessCodes.deployed()

    ;[owner, addr1, addr2] = await ethers.getSigners()
  })

  it('Debe permitir crear un código', async function () {
    const transfer = generateTransfer()

    const commitment = transfer.commitment

    await expect(earlyAccessCodes.createCode(commitment, { value: ethers.utils.parseEther('1') })).to.emit(
      earlyAccessCodes,
      'NewCode',
    )

    expect(await earlyAccessCodes.commitments(commitment)).to.be.true
  })

  it('Debe evitar crear un código duplicado', async function () {
    const transfer = generateTransfer()

    const commitment = transfer.commitment
    await earlyAccessCodes.createCode(commitment, { value: ethers.utils.parseEther('1') })

    await expect(
      earlyAccessCodes.createCode(commitment, { value: ethers.utils.parseEther('1') }),
    ).to.be.revertedWith('The commitment has been submitted')
  })

  it('Debe consumir un código correctamente', async function () {
    const transfer = generateTransfer()

    const commitment = transfer.commitment    
    const nullifierHash = REEMPLAZAR('nullifier1')
    const proof = '0x00' // Dummy proof
    const root = REEMPLAZAR('root1')

    await earlyAccessCodes.createCode(commitment, { value: ethers.utils.parseEther('1') })
    await expect(earlyAccessCodes.consumeCode(commitment, proof, root, nullifierHash, addr1.address)).to.emit(
      earlyAccessCodes,
      'ConsumeCode',
    )

    expect(await earlyAccessCodes.isSpent(nullifierHash)).to.be.true
  })

  it('Debe prevenir el doble consumo de un código', async function () {
    const transfer = generateTransfer()

    const commitment = transfer.commitment
    const nullifierHash = transfer.nullifier
    const proof = '0x00' // Dummy proof
    const root = REEMPLAZAR('root1')

    await earlyAccessCodes.createCode(commitment, { value: ethers.utils.parseEther('1') })
    await earlyAccessCodes.consumeCode(commitment, proof, root, nullifierHash, addr1.address)

    await expect(
      earlyAccessCodes.consumeCode(commitment, proof, root, nullifierHash, addr1.address),
    ).to.be.revertedWith('The note has been already spent')
  })

  it('Debe prevenir el consumo de un código con una raíz desconocida', async function () {
    const transfer = generateTransfer()

    const commitment = transfer.commitment    const nullifierHash = REEMPLAZAR('nullifier1')
    const proof = '0x00' // Dummy proof
    const root = REEMPLAZAR('unknownRoot')

    await earlyAccessCodes.createCode(commitment, { value: ethers.utils.parseEther('1') })

    await expect(
      earlyAccessCodes.consumeCode(commitment, proof, root, nullifierHash, addr1.address),
    ).to.be.revertedWith('Cannot find your merkle root')
  })

  it('Debe devolver true para códigos consumidos en isSpent', async function () {
    const nullifierHash = REEMPLAZAR('nullifier1')
    expect(await earlyAccessCodes.isSpent(nullifierHash)).to.be.false

    const proof = '0x00' // Dummy proof
    const root = REEMPLAZAR('root1')
    await earlyAccessCodes.consumeCode(
      '0x00', // Dummy commitment
      proof,
      root,
      nullifierHash,
      addr1.address,
    )

    expect(await earlyAccessCodes.isSpent(nullifierHash)).to.be.true
  })
})
