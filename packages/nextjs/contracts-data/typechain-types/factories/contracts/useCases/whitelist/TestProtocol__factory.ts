/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  TestProtocol,
  TestProtocolInterface,
} from "../../../../contracts/useCases/whitelist/TestProtocol";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_whitelist",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "UserNotWhitelistedAndBetaAccessIsEnabled",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "AddressNotAllowed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "BetaAccessDisabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "BetaAccessEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "WhitelistCodeUsed",
    type: "event",
  },
  {
    inputs: [],
    name: "betaAccessEnabled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_enabled",
        type: "bool",
      },
    ],
    name: "setBetaAccessEnabled",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "whitelist",
    outputs: [
      {
        internalType: "contract IWhitelist",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080346100d557601f6105a938819003918201601f19168301916001600160401b038311848410176100da578084926020946040528339810103126100d557516001600160a01b0390818116908190036100d55733156100bc576000543360018060a01b0319821617600055604051923391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3600180546001600160a81b031916909117600160a01b1790556104b890816100f18239f35b604051631e4fbdf760e01b815260006004820152602490fd5b600080fd5b634e487b7160e01b600052604160045260246000fdfe60806040908082526004908136101561001757600080fd5b600092833560e01c91826301a04838146103fa57508163715018a61461039d5781638da5cb5b1461037557816393e59dc11461034c578163f2fde38b146102be578163f8a8fd6d146100bb575063feddc5831461007357600080fd5b346100b75760203660031901126100b757358015158091036100b75761009761041e565b6001805460ff60a01b191660a09290921b60ff60a01b1691909117905580f35b5080fd5b839150346100b757816003193601126100b75760015460ff8160a01c169081610236575b506101fc578051904282526020917ffa92bfd14e6818f736cbf84d3d4dc8497987f0a65783edd37a763e52f8a6df08833392a2805193606085019085821067ffffffffffffffff8311176101e957508152602f84527f5465737450726f746f636f6c3a207465737428292063616c6c65642062792077828501526e3434ba32b634b9ba32b2103ab9b2b960891b81850152518181019163104c13eb60e21b8352806024830152845190816044840152845b8281106101d55785808087876101c16064828a86838284010152601f8019910116810103604481018452018261044a565b51906a636f6e736f6c652e6c6f675afa5080f35b868101820151848201606401528101610190565b634e487b7160e01b855260419052602484fd5b809150514281527ffa98c4deefd5a7d4f54c40f3c202f4d6f76dac9b5cda4e73f42242706f08ff6a60203392a251633065d42560e11b8152fd5b8251633af32abf60e01b815233868201529150602090829060249082906001600160a01b03165afa9081156102b2578391610274575b5015846100df565b90506020813d82116102aa575b8161028e6020938361044a565b810103126102a6575180151581036102a6578461026c565b8280fd5b3d9150610281565b505051903d90823e3d90fd5b9050346102a65760203660031901126102a6576001600160a01b03823581811693919290849003610348576102f161041e565b831561033257505082546001600160a01b0319811683178455167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b51631e4fbdf760e01b8152908101849052602490fd5b8480fd5b8390346100b757816003193601126100b75760015490516001600160a01b039091168152602090f35b8390346100b757816003193601126100b757905490516001600160a01b039091168152602090f35b83346103f757806003193601126103f7576103b661041e565b80546001600160a01b03198116825581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b8490346100b757816003193601126100b75760209060ff60015460a01c1615158152f35b6000546001600160a01b0316330361043257565b60405163118cdaa760e01b8152336004820152602490fd5b90601f8019910116810190811067ffffffffffffffff82111761046c57604052565b634e487b7160e01b600052604160045260246000fdfea2646970667358221220ea0686c576d9b5e02365146e6ef8a50832591e8d969a8f1ac9afa9102837a2c564736f6c63430008140033";

type TestProtocolConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestProtocolConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestProtocol__factory extends ContractFactory {
  constructor(...args: TestProtocolConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _whitelist: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_whitelist, overrides || {});
  }
  override deploy(
    _whitelist: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_whitelist, overrides || {}) as Promise<
      TestProtocol & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): TestProtocol__factory {
    return super.connect(runner) as TestProtocol__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestProtocolInterface {
    return new Interface(_abi) as TestProtocolInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): TestProtocol {
    return new Contract(address, _abi, runner) as unknown as TestProtocol;
  }
}
