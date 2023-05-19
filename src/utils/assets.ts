import { ApiPromise } from "@polkadot/api";
import { BN, hexToBn, hexToString } from "@polkadot/util";
import { BN0 } from "@src/constants/assets";
import { BigNumberish, ethers } from "ethers";
import { captureError } from "./error-handling";
import { Asset } from "@src/providers/assetProvider/types";

export const getNatitveAssetBalance = async (
  api: ApiPromise | ethers.providers.JsonRpcProvider | null,
  accountAddress: string
): Promise<BN | BigNumberish> => {
  try {
    const _amount = BN0;

    if (!api) return _amount;

    if ("query" in api) {
      const { data }: any =
        (await api.query.system?.account(accountAddress)) || {};

      return data.free as BN;
    }

    if ("getBalance" in api) {
      const amount = await api.getBalance(accountAddress);
      return amount;
    }

    return _amount;
  } catch (error) {
    captureError(error);
    return BN0;
  }
};

export const getAssetUSDPrice = async (query: string) => {
  const _query = query.toLowerCase();
  try {
    const data = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${_query}&vs_currencies=usd`
    );

    const json = await data.json();

    return json?.[_query]?.["usd"] || 0;
  } catch (error) {
    captureError(error);
    return 0;
  }
};

export const formatAmountWithDecimals = (
  amount: number,
  decimals = 0,
  assetDecimals = 0
) => {
  return Number((amount / 10 ** assetDecimals || 0).toFixed(decimals));
};

export const formatBN = (bn: string, decimals: number) => {
  let _number = bn;

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
    _number = "0";
  }

  return _number;
};

export const formatUSDAmount = (amount: number) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 6,
  });
};

export const getWasmAssets = async (
  api: ApiPromise,
  chainName: string,
  address: string,
  dispatch: (assetId: string, newValue: BN) => void
) => {
  const assets: Asset[] = [];
  const unsubs: any[] = [];
  try {
    let assetPallet = null;
    let balanceMethod: any = null;

    switch (chainName) {
      case "Acala":
        assetPallet = api.query.assetRegistry.assetMetadatas;
        balanceMethod = api.query.tokens.accounts;
        break;
      default:
        assetPallet = api.query.assets?.metadata;
        balanceMethod = api.query.assets?.account;
        break;
    }

    if (!assetPallet || !balanceMethod)
      return {
        assets,
        unsubs,
      };

    const entries = await assetPallet?.entries();

    entries?.forEach(([metadata, asset]) => {
      const jsonAsset = asset.toJSON() as {
        name: string;
        symbol: string;
        decimals: number;
      };

      const id = metadata.args[0]?.id
        ? String(metadata.args[0]?.id)
        : metadata.args[0].toString();
      const name = hexToString(jsonAsset?.name || "");
      const symbol = hexToString(jsonAsset?.symbol || "");
      const balance = BN0;
      const decimals = Number(jsonAsset?.decimals || 0);

      let aditionalData: any = null;

      if (chainName === "Acala") {
        const token = metadata.args[0].toJSON() as any;

        if (
          !token?.nativeAssetId &&
          !token?.foreignAssetId &&
          !token?.stableAssetId
        ) {
          return;
        }

        if (token?.nativeAssetId) {
          aditionalData = {
            tokenId: {
              Token: token?.nativeAssetId?.token,
            },
          };
        }

        if (token?.foreignAssetId) {
          aditionalData = {
            tokenId: {
              ForeignAsset: token.foreignAssetId,
            },
          };
        }

        if (token?.stableAssetId) {
          aditionalData = {
            tokenId: {
              StableAssetPoolToken: token.stableAssetId,
            },
          };
        }
      }

      assets.push({
        id,
        name,
        symbol,
        balance,
        decimals,
        aditionalData,
      });
    });

    await Promise.all(
      assets.map(async (asset) => {
        const params = [];

        if (chainName === "Acala") {
          params.push(address, asset.aditionalData?.tokenId);
        } else {
          params.push(asset.id, address);
        }

        const unsub = await balanceMethod?.(
          ...params,
          (data: {
            toJSON: () => {
              balance: number | string;
              free: number;
            };
          }) => {
            const result = data.toJSON();
            let balance = BN0;

            if (result?.balance) {
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

            if (result?.free) {
              balance = new BN(String(result?.free));
            }

            dispatch(asset.id, balance);
          }
        );

        unsubs.push(unsub);
      })
    );
  } catch (error) {
    captureError(error);
  }
  return {
    assets,
    unsubs,
  };
};
