import { ApiPromise } from "@polkadot/api";
import { BN, hexToBn } from "@polkadot/util";
import { BN0 } from "@src/constants/assets";
import { BigNumber, ethers } from "ethers";
import { captureError } from "./error-handling";
import { Asset } from "@src/providers/assetProvider/types";
import {
  GenericStorageEntryFunction,
  PromiseResult,
  StorageEntryBase,
  StorageEntryPromiseOverloads,
} from "@polkadot/api/types";
import { AnyTuple } from "@polkadot/types-codec/types";
import { CURRENCIES } from "@utils/constants";
import { SUBSTRATE_ASSETS_MAP } from "@src/constants/assets-map";
import AccountEntity from "@src/storage/entities/Account";
import { OlProvider } from "@src/services/ol/OlProvider";

const getType = (type: string) =>{
  if(type === "imported_wasm"){
    return type.slice(-4);
  }
  else if( type === "imported_evm"){
    return type.slice(-3);
  }
  else{
    return type;
  }
}
export const getNatitveAssetBalance = async (
  api: {
    provider :ApiPromise | ethers.providers.JsonRpcProvider | OlProvider | null
    type: "wasm" | "evm" | "ol"},
  accountAddress: string,
  account : AccountEntity
) => {
  const _amounts = {
    balance: BN0,
  };
  try {

    if (!api) return _amounts;
    if (api.type === "wasm" && getType(account.type.toLowerCase()) === "wasm") {
      const { data } = (await (api.provider as ApiPromise).query.system.account(
        accountAddress
      )) as unknown as {
        data: {
          free: string;
          reserved: string;
          miscFrozen?: string;
          frozen?: string;
          feeFrozen?: string;
        };
      };
      return getSubtrateNativeBalance(data);
    }


    if (api.type === "ol") {
      const balance = await (api.provider as OlProvider).getBalance(accountAddress);
      return {
        balance,
      };
    }

    else if (api.type ===  "evm" && getType(account.type.toLowerCase()) === "evm") {
      
      const amount = await (api.provider as ethers.providers.JsonRpcProvider).getBalance(accountAddress)
      return {
        balance: amount,
      };
    }
    else{
      return _amounts;
    }
  } catch (error) {
    captureError(error);

    return _amounts;
  }
};

export const getAssetUSDPrice = async (query: string[]) => {
  const _query = JSON.stringify(query.map(symbol => symbol))
  const gqlQuery = `
  query {
    getTokenPrice(tokens: ${_query}) {
      tokens {
        usd,
        symbol
      }
    }
  }
`;
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: gqlQuery }),
    });
    const obj :any = {}
    const data = await response.json();
     const objPrice = data.data.getTokenPrice.tokens 
     objPrice.forEach((item:any) =>  obj[item.symbol] = item.usd)
    return obj || {};
  } catch (error) {
    captureError(error);
    return 0;
  }
};

export const formatAmountWithDecimals = (
  amount = 0,
  decimals = 0,
  assetDecimals = 0
) => {
  return Number((amount / 10 ** assetDecimals).toFixed(decimals));
};

export const formatStringAmountWithDecimals = (amount = "", decimals = 0) => {
  const [_amount, _decimals] = amount.split(".");

  if (!_decimals) return amount;

  const _newDecimals = (_decimals || "").substr(0, decimals);

  return `${_amount}.${_newDecimals}`;
};

export const formatBN = (bn: string, decimals = 1, fixed?: null | number) => {
  let _number = bn;

  if (!decimals) return "0";

  if (_number.length < decimals) {
    const dif = decimals - _number.length;
    for (let index = 0; index < dif + 1; index++) {
      _number = `0${_number}`;
    }
  }
  _number = _number.slice(0, -decimals) + "." + _number.slice(-decimals);

  while (_number.endsWith("0")) {
    _number = _number.slice(0, _number.length - 1);
  }

  if (_number.endsWith(".")) {
    _number = _number.slice(0, _number.length - 1);
  }

  if (_number.startsWith(".")) {
    _number = `0${_number}`;
  }

  if (fixed && _number.includes(".")) {
    const [integer, decimal] = _number.split(".");
    _number = `${integer}.${decimal.slice(0, fixed)}`;
  }

  return _number;
};

export const formatUSDAmount = (amount: number) => {
  const currencyInfo = getCurrencyInfo();
  const currencySymbol = currencyInfo.symbol;
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: currencySymbol,
    maximumFractionDigits: 6,
  });
};

export const transformAmountStringToBN = (amount: string, decimals: number) => {
  try {
    const [amountWithoutDot, dotAmount] = amount.split(".");
    const _dotAmount = dotAmount || "";
    const missingUnits = decimals - _dotAmount.length;
    const amountWithMissingUnits = `${amountWithoutDot}${_dotAmount}${"0".repeat(
      missingUnits
    )}`;

    const amountBN = new BN(amountWithMissingUnits);
    return amountBN;
  } catch (error) {
    return new BN("0");
  }
};

export const transformAmountStringToBigNumber = (
  amount: string,
  decimals: number
) => {
  try {
    const [amountWithoutDot, dotAmount] = amount.split(".");
    const _dotAmount = dotAmount || "";
    const missingUnits = decimals - _dotAmount.length;
    const amountWithMissingUnits = `${amountWithoutDot}${_dotAmount}${"0".repeat(
      missingUnits
    )}`;

    const amountBN = BigNumber.from(amountWithMissingUnits);
    return amountBN;
  } catch (error) {
    return BigNumber.from("0");
  }
};

export const getCurrencyInfo = () => {
  const selectedCurrency = localStorage.getItem("currency") || "usd";
  const currencyInfo = CURRENCIES.find(
    (currency) => currency.symbol === selectedCurrency
  );
  return currencyInfo ? currencyInfo : CURRENCIES[0];
};

export const getWasmAssets = async (
  api: ApiPromise,
  chainId: string,
  address: string,
  dispatch: (
    assetId: string,
    amounts: {
      balance: BN;
      frozen: BN;
      reserved: BN;
      transferable: BN;
    }
  ) => void
) => {
  const assets: Asset[] = [];
  const unsubs: unknown[] = [];
  try {
    let balanceMethod:
      | (PromiseResult<GenericStorageEntryFunction> &
          StorageEntryBase<"promise", GenericStorageEntryFunction, AnyTuple> &
          StorageEntryPromiseOverloads)
      | null = null;
    switch (chainId) {
      case "acala":
        balanceMethod = api.query.tokens.accounts;
        break;
      case "mandala":
        balanceMethod = api.query.tokens.accounts;
        break;
      default:
        balanceMethod = api.query.assets?.account;
        break;
    }
    if (!balanceMethod)
      return {
        assets,
        unsubs,
      };

    const mappedAssets = SUBSTRATE_ASSETS_MAP[chainId] || [];
    const assetBalances = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mappedAssets.map((asset: any) => {
        const params = [];
        if (["acala", "mandala"].includes(chainId.toLowerCase())) {
          params.push(address, asset.id);
        } else {
          params.push(asset.id, address);
        }

        return balanceMethod?.(...params);
      })
    );
    assetBalances.forEach((data, index) => {
      const asset = mappedAssets[index];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _data = getSubtrateNonNativeBalance(data as any);
      assets.push({
        ...asset,
        id: typeof asset.id === "object" ? JSON.stringify(asset.id) : asset.id,
        ..._data,
      });
    });
    await Promise.all(
      assets.map(async (asset) => {
        
        const params = [];
        if (["acala", "mandala"].includes(chainId.toLowerCase())) {
          params.push(address, JSON.parse(asset.id));
        } else {
          params.push(asset.id, address);
        }
        const unsub = await balanceMethod?.(
          ...params,
          (data: {
            toJSON: () => {
              balance: number | string;
              free: number;
              isFrozen?: boolean;
              reserved?: number;
              frozen?: number;
            };
          }) => {
            
            const _data = getSubtrateNonNativeBalance(data);
            dispatch(asset.id, _data);
          }
        )
        unsubs.push(unsub);
      })
    );
    return {
      assets,
      unsubs,
    };
  } catch (error) {
    captureError(error);
    return {
      assets,
      unsubs,
    };
  }
};

export const getSubtrateNativeBalance = (
  data:
    | {
        free: string;
        reserved: string;
        miscFrozen?: string;
        frozen?: string;
        feeFrozen?: string;
      }
    | undefined
) => {
  if (!data) {
    return {
      balance: BN0,
      frozen: BN0,
      reserved: BN0,
      transferable: BN0,
    };
  }

  const free = new BN(String(data?.free || 0));
  const reserved = new BN(String(data?.reserved || 0));
  const miscFrozen = new BN(String(data?.miscFrozen || data?.frozen || 0));
  const feeFrozen = new BN(String(data?.feeFrozen || 0));
  const frozen = miscFrozen.add(feeFrozen);
  const transferable = free.sub(frozen).sub(reserved);
  return {
    balance: free,
    transferable,
    reserved,
    frozen,
  };
};

export const getSubtrateNonNativeBalance = (
  data:
    | {
        toJSON: () => {
          balance: number | string;
          free: number;
          isFrozen?: boolean;
          reserved?: number;
          frozen?: number;
        };
      }
    | undefined
) => {
  if (!data) {
    return {
      balance: BN0,
      frozen: BN0,
      reserved: BN0,
      transferable: BN0,
    };
  }

  const result = data.toJSON();
  let balance = BN0;
  let frozen = BN0;
  let reserved = BN0;

  if (result?.balance && !result.isFrozen) {
    if (typeof result?.balance === "number") {
      balance = new BN(String(result?.balance));
    }

    if (
      typeof result.balance === "string" &&
      (result.balance as string).startsWith("0x")
    ) {
      balance = hexToBn(result.balance);
    }
  }

  if (result?.balance && result.isFrozen) {
    if (typeof result?.balance === "number") {
      frozen = new BN(String(result?.balance));
    }

    if (
      typeof result.balance === "string" &&
      (result.balance as string).startsWith("0x")
    ) {
      frozen = hexToBn(result.balance);
    }
  }

  if (result?.free) {
    if (
      typeof result?.free === "string" &&
      String(result.free)?.startsWith("0x")
    ) {
      balance = hexToBn(result.free);
    } else {
      balance = new BN(String(result?.free));
    }
  }

  if (result?.reserved) {
    if (
      typeof result?.reserved === "string" &&
      String(result.reserved)?.startsWith("0x")
    ) {
      reserved = hexToBn(result.reserved);
    } else {
      reserved = new BN(String(result?.reserved));
    }
  }

  if (result?.frozen) {
    if (
      typeof result?.frozen === "string" &&
      String(result.frozen)?.startsWith("0x")
    ) {
      frozen = hexToBn(result.frozen);
    } else {
      frozen = new BN(String(result?.frozen));
    }
  }

  return {
    balance,
    frozen,
    reserved,
    transferable: balance.sub(frozen).sub(reserved),
  };
};

export const formatFees = (fees: string, decimals: number) => {
  const formated = formatBN(fees, decimals, 6);

  const _decimals = formated.split(".")[1] || "";
  const threeFirstDecimals = _decimals.slice(0, 3);

  if (threeFirstDecimals === "000") {
    return formated;
  }

  const amount = formated.split(".")[0];
  return `${amount}.${threeFirstDecimals}`;
};
