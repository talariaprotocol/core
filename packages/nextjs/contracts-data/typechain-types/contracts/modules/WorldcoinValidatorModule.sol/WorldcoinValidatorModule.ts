/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface WorldcoinValidatorModuleInterface extends Interface {
  getFunction(
    nameOrSignature: "validate" | "worldcoinVerifier"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "validate", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "worldcoinVerifier",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "validate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "worldcoinVerifier",
    data: BytesLike
  ): Result;
}

export interface WorldcoinValidatorModule extends BaseContract {
  connect(runner?: ContractRunner | null): WorldcoinValidatorModule;
  waitForDeployment(): Promise<this>;

  interface: WorldcoinValidatorModuleInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  validate: TypedContractMethod<[arg: BytesLike], [boolean], "nonpayable">;

  worldcoinVerifier: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "validate"
  ): TypedContractMethod<[arg: BytesLike], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "worldcoinVerifier"
  ): TypedContractMethod<[], [string], "view">;

  filters: {};
}
