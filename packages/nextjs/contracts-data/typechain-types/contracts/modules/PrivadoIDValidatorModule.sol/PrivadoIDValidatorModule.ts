/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
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

export declare namespace ICircuitValidator {
  export type CircuitQueryStruct = {
    circuitId: string;
    schema: BigNumberish;
    slotIndex: BigNumberish;
    operator: BigNumberish;
    value: BigNumberish[];
  };

  export type CircuitQueryStructOutput = [
    circuitId: string,
    schema: bigint,
    slotIndex: bigint,
    operator: bigint,
    value: bigint[]
  ] & {
    circuitId: string;
    schema: bigint;
    slotIndex: bigint;
    operator: bigint;
    value: bigint[];
  };
}

export interface PrivadoIDValidatorModuleInterface extends Interface {
  getFunction(
    nameOrSignature: "PrivadoIDValidator" | "query" | "validate"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "PrivadoIDValidator",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "query", values?: undefined): string;
  encodeFunctionData(functionFragment: "validate", values: [BytesLike]): string;

  decodeFunctionResult(
    functionFragment: "PrivadoIDValidator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "query", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "validate", data: BytesLike): Result;
}

export interface PrivadoIDValidatorModule extends BaseContract {
  connect(runner?: ContractRunner | null): PrivadoIDValidatorModule;
  waitForDeployment(): Promise<this>;

  interface: PrivadoIDValidatorModuleInterface;

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

  PrivadoIDValidator: TypedContractMethod<[], [string], "view">;

  query: TypedContractMethod<
    [],
    [
      [string, bigint, bigint, bigint] & {
        circuitId: string;
        schema: bigint;
        slotIndex: bigint;
        operator: bigint;
      }
    ],
    "view"
  >;

  validate: TypedContractMethod<[arg: BytesLike], [boolean], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "PrivadoIDValidator"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "query"
  ): TypedContractMethod<
    [],
    [
      [string, bigint, bigint, bigint] & {
        circuitId: string;
        schema: bigint;
        slotIndex: bigint;
        operator: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "validate"
  ): TypedContractMethod<[arg: BytesLike], [boolean], "nonpayable">;

  filters: {};
}
