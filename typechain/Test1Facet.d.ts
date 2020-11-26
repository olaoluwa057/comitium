/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface Test1FacetInterface extends ethers.utils.Interface {
  functions: {
    "c_0xf96e4b12(bytes32)": FunctionFragment;
    "test1Func1()": FunctionFragment;
    "test1Func10()": FunctionFragment;
    "test1Func11()": FunctionFragment;
    "test1Func12()": FunctionFragment;
    "test1Func13()": FunctionFragment;
    "test1Func14()": FunctionFragment;
    "test1Func15()": FunctionFragment;
    "test1Func16()": FunctionFragment;
    "test1Func17()": FunctionFragment;
    "test1Func18()": FunctionFragment;
    "test1Func19()": FunctionFragment;
    "test1Func2()": FunctionFragment;
    "test1Func20()": FunctionFragment;
    "test1Func3()": FunctionFragment;
    "test1Func4()": FunctionFragment;
    "test1Func5()": FunctionFragment;
    "test1Func6()": FunctionFragment;
    "test1Func7()": FunctionFragment;
    "test1Func8()": FunctionFragment;
    "test1Func9()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "c_0xf96e4b12",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func1",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func10",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func11",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func12",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func13",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func14",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func15",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func16",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func17",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func18",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func19",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func2",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func20",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func3",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func4",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func5",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func6",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func7",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func8",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "test1Func9",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "c_0xf96e4b12",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "test1Func1", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "test1Func10",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "test1Func11",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "test1Func12",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "test1Func13",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "test1Func14",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "test1Func15",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "test1Func16",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "test1Func17",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "test1Func18",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "test1Func19",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "test1Func2", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "test1Func20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "test1Func3", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "test1Func4", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "test1Func5", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "test1Func6", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "test1Func7", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "test1Func8", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "test1Func9", data: BytesLike): Result;

  events: {
    "TestEvent(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "TestEvent"): EventFragment;
}

export class Test1Facet extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: Test1FacetInterface;

  functions: {
    c_0xf96e4b12(
      c__0xf96e4b12: BytesLike,
      overrides?: CallOverrides
    ): Promise<{
      0: void;
    }>;

    "c_0xf96e4b12(bytes32)"(
      c__0xf96e4b12: BytesLike,
      overrides?: CallOverrides
    ): Promise<{
      0: void;
    }>;

    test1Func1(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func1()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func10(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func10()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func11(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func11()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func12(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func12()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func13(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func13()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func14(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func14()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func15(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func15()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func16(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func16()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func17(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func17()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func18(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func18()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func19(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func19()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func2(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func2()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func20(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func20()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func3(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func3()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func4(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func4()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func5(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func5()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func6(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func6()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func7(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func7()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func8(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func8()"(overrides?: Overrides): Promise<ContractTransaction>;

    test1Func9(overrides?: Overrides): Promise<ContractTransaction>;

    "test1Func9()"(overrides?: Overrides): Promise<ContractTransaction>;
  };

  c_0xf96e4b12(
    c__0xf96e4b12: BytesLike,
    overrides?: CallOverrides
  ): Promise<void>;

  "c_0xf96e4b12(bytes32)"(
    c__0xf96e4b12: BytesLike,
    overrides?: CallOverrides
  ): Promise<void>;

  test1Func1(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func1()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func10(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func10()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func11(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func11()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func12(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func12()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func13(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func13()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func14(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func14()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func15(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func15()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func16(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func16()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func17(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func17()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func18(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func18()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func19(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func19()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func2(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func2()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func20(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func20()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func3(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func3()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func4(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func4()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func5(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func5()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func6(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func6()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func7(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func7()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func8(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func8()"(overrides?: Overrides): Promise<ContractTransaction>;

  test1Func9(overrides?: Overrides): Promise<ContractTransaction>;

  "test1Func9()"(overrides?: Overrides): Promise<ContractTransaction>;

  callStatic: {
    c_0xf96e4b12(
      c__0xf96e4b12: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "c_0xf96e4b12(bytes32)"(
      c__0xf96e4b12: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    test1Func1(overrides?: CallOverrides): Promise<void>;

    "test1Func1()"(overrides?: CallOverrides): Promise<void>;

    test1Func10(overrides?: CallOverrides): Promise<void>;

    "test1Func10()"(overrides?: CallOverrides): Promise<void>;

    test1Func11(overrides?: CallOverrides): Promise<void>;

    "test1Func11()"(overrides?: CallOverrides): Promise<void>;

    test1Func12(overrides?: CallOverrides): Promise<void>;

    "test1Func12()"(overrides?: CallOverrides): Promise<void>;

    test1Func13(overrides?: CallOverrides): Promise<void>;

    "test1Func13()"(overrides?: CallOverrides): Promise<void>;

    test1Func14(overrides?: CallOverrides): Promise<void>;

    "test1Func14()"(overrides?: CallOverrides): Promise<void>;

    test1Func15(overrides?: CallOverrides): Promise<void>;

    "test1Func15()"(overrides?: CallOverrides): Promise<void>;

    test1Func16(overrides?: CallOverrides): Promise<void>;

    "test1Func16()"(overrides?: CallOverrides): Promise<void>;

    test1Func17(overrides?: CallOverrides): Promise<void>;

    "test1Func17()"(overrides?: CallOverrides): Promise<void>;

    test1Func18(overrides?: CallOverrides): Promise<void>;

    "test1Func18()"(overrides?: CallOverrides): Promise<void>;

    test1Func19(overrides?: CallOverrides): Promise<void>;

    "test1Func19()"(overrides?: CallOverrides): Promise<void>;

    test1Func2(overrides?: CallOverrides): Promise<void>;

    "test1Func2()"(overrides?: CallOverrides): Promise<void>;

    test1Func20(overrides?: CallOverrides): Promise<void>;

    "test1Func20()"(overrides?: CallOverrides): Promise<void>;

    test1Func3(overrides?: CallOverrides): Promise<void>;

    "test1Func3()"(overrides?: CallOverrides): Promise<void>;

    test1Func4(overrides?: CallOverrides): Promise<void>;

    "test1Func4()"(overrides?: CallOverrides): Promise<void>;

    test1Func5(overrides?: CallOverrides): Promise<void>;

    "test1Func5()"(overrides?: CallOverrides): Promise<void>;

    test1Func6(overrides?: CallOverrides): Promise<void>;

    "test1Func6()"(overrides?: CallOverrides): Promise<void>;

    test1Func7(overrides?: CallOverrides): Promise<void>;

    "test1Func7()"(overrides?: CallOverrides): Promise<void>;

    test1Func8(overrides?: CallOverrides): Promise<void>;

    "test1Func8()"(overrides?: CallOverrides): Promise<void>;

    test1Func9(overrides?: CallOverrides): Promise<void>;

    "test1Func9()"(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    TestEvent(something: null): EventFilter;
  };

  estimateGas: {
    c_0xf96e4b12(
      c__0xf96e4b12: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "c_0xf96e4b12(bytes32)"(
      c__0xf96e4b12: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    test1Func1(overrides?: Overrides): Promise<BigNumber>;

    "test1Func1()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func10(overrides?: Overrides): Promise<BigNumber>;

    "test1Func10()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func11(overrides?: Overrides): Promise<BigNumber>;

    "test1Func11()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func12(overrides?: Overrides): Promise<BigNumber>;

    "test1Func12()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func13(overrides?: Overrides): Promise<BigNumber>;

    "test1Func13()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func14(overrides?: Overrides): Promise<BigNumber>;

    "test1Func14()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func15(overrides?: Overrides): Promise<BigNumber>;

    "test1Func15()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func16(overrides?: Overrides): Promise<BigNumber>;

    "test1Func16()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func17(overrides?: Overrides): Promise<BigNumber>;

    "test1Func17()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func18(overrides?: Overrides): Promise<BigNumber>;

    "test1Func18()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func19(overrides?: Overrides): Promise<BigNumber>;

    "test1Func19()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func2(overrides?: Overrides): Promise<BigNumber>;

    "test1Func2()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func20(overrides?: Overrides): Promise<BigNumber>;

    "test1Func20()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func3(overrides?: Overrides): Promise<BigNumber>;

    "test1Func3()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func4(overrides?: Overrides): Promise<BigNumber>;

    "test1Func4()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func5(overrides?: Overrides): Promise<BigNumber>;

    "test1Func5()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func6(overrides?: Overrides): Promise<BigNumber>;

    "test1Func6()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func7(overrides?: Overrides): Promise<BigNumber>;

    "test1Func7()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func8(overrides?: Overrides): Promise<BigNumber>;

    "test1Func8()"(overrides?: Overrides): Promise<BigNumber>;

    test1Func9(overrides?: Overrides): Promise<BigNumber>;

    "test1Func9()"(overrides?: Overrides): Promise<BigNumber>;
  };

  populateTransaction: {
    c_0xf96e4b12(
      c__0xf96e4b12: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "c_0xf96e4b12(bytes32)"(
      c__0xf96e4b12: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    test1Func1(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func1()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func10(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func10()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func11(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func11()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func12(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func12()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func13(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func13()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func14(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func14()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func15(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func15()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func16(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func16()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func17(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func17()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func18(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func18()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func19(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func19()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func2(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func2()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func20(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func20()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func3(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func3()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func4(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func4()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func5(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func5()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func6(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func6()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func7(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func7()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func8(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func8()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    test1Func9(overrides?: Overrides): Promise<PopulatedTransaction>;

    "test1Func9()"(overrides?: Overrides): Promise<PopulatedTransaction>;
  };
}
