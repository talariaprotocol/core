export const stringifyBigInts = require('websnark/tools/stringifybigint').stringifyBigInts
export const snarkjs = require('snarkjs')
export const bigInt = snarkjs.bigInt
export const crypto = require('crypto')
export const circomlib = require('circomlib')
export const MerkleTree = require('fixed-merkle-tree')

export const rbigint = (nbytes: number) => snarkjs.bigInt.leBuff2int(crypto.randomBytes(nbytes))
export const pedersenHash = (data: Buffer) => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0]
export const toFixedHex = (number: any, length = 32) =>
  '0x' +
  bigInt(number)
    .toString(16)
    .padStart(length * 2, '0')
export const getRandomRecipient = () => rbigint(20)

export function generateTransfer() {
  let transfer = {
    secret: rbigint(31),
    nullifier: rbigint(31),
  }
  const preimage = Buffer.concat([transfer.nullifier.leInt2Buff(31), transfer.secret.leInt2Buff(31)])
  return {
    ...transfer,
    
    commitment: toFixedHex(pedersenHash(preimage))
  }
}
