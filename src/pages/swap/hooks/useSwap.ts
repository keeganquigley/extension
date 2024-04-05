import { useEffect, useMemo, useState } from "react";
import {
  useAccountContext,
  useAssetContext,
  useNetworkContext,
} from "@src/providers";
import { decodeAddress } from "@polkadot/util-crypto";
import { BN } from "@polkadot/util";
import { formatBN, transformAmountStringToBN } from "@src/utils/assets";
import { useLoading, useToast } from "@src/hooks";
import { captureError } from "@src/utils/error-handling";
import { ApiPromise } from "@polkadot/api";
import { ethers } from "ethers";
import { StealthEX } from "../stealthEX";
import { ActiveSwaps, SwapAsset, Swapper } from "../base";
import { useNavigate } from "react-router-dom";
import { BALANCE } from "@src/routes/paths";
import { useTranslation } from "react-i18next";
import { AccountType } from "@src/accounts/types";
import { messageAPI } from "@src/messageAPI/api";

export interface TxInfoState {
  bridgeType: string;
  bridgeName: string;
  bridgeFee: string;
  gasFee: string | null;
  destinationAddress: string | null;
}

interface Tx {
  addressBridge: string;
  addressFrom: string;
  addressTo: string;
  amountBridge: string;
  amountFrom: string;
  amountTo: string;
  chainBridge: {
    name: string;
    image: string;
  };
  chainFrom: {
    name: string;
    image: string;
  };
  chainTo: {
    name: string;
    image: string;
  };
  assetBridge: {
    symbol: string;
    image: string;
  };
  assetFrom: {
    symbol: string;
    image: string;
  };
  assetTo: {
    symbol: string;
    image: string;
    isAproximate: boolean;
  };
  fee: {
    estimatedFee: string;
    estimatedTotal: string;
  };
  swapId: string;
}

export const useSwap = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("swap");

  const {
    state: { api, selectedChain },
  } = useNetworkContext();

  const {
    state: { selectedAccount },
  } = useAccountContext();

  const {
    state: { assets: _assets },
  } = useAssetContext();

  const { isLoading, starLoading, endLoading } = useLoading();
  const {
    isLoading: isLoadingActiveSwaps,
    starLoading: starLoadingActiveSwaps,
    endLoading: endLoadingActiveSwaps,
  } = useLoading();
  const {
    isLoading: isLoadingBuyAsset,
    starLoading: starLoadingBuyAsset,
    endLoading: endLoadingBuyAsset,
  } = useLoading();
  const {
    isLoading: isLoadingSellAsset,
    starLoading: starLoadingSellAsset,
    endLoading: endLoadingSellAsset,
  } = useLoading();
  const {
    isLoading: isCreatingSwap,
    starLoading: starCreatingSwap,
    endLoading: endCreatingSwap,
  } = useLoading();

  const { showErrorToast, showSuccessToast } = useToast();

  const [assets, setAssets] = useState<SwapAsset[]>([]);

  const [assetToSell, setAssetToSell] = useState<Partial<SwapAsset>>({
    label: "",
    balance: new BN("0").toString(),
    decimals: 0,
    symbol: "",
  });
  const [assetsToSell, setAssetsToSell] = useState<SwapAsset[]>([]);

  const [assetToBuy, setAssetToBuy] = useState<Partial<SwapAsset>>({
    label: "",
    balance: new BN("0").toString(),
    decimals: 0,
    symbol: "",
  });
  const [assetsToBuy, setAssetsToBuy] = useState<SwapAsset[]>([]);

  const [recipient, setRecipient] = useState({
    isNotOwnAddress: false,
    address: "",
  });

  const [txInfo, setTxInfo] = useState<TxInfoState>({
    bridgeType: "",
    bridgeName: "",
    bridgeFee: "",
    gasFee: null,
    destinationAddress: null,
  });

  const [tx, setTx] = useState<Tx>({
    addressBridge: "",
    addressFrom: "",
    addressTo: "",
    amountBridge: "",
    amountFrom: "",
    amountTo: "",
    chainBridge: {
      name: "",
      image: "",
    },
    chainFrom: {
      name: "",
      image: "",
    },
    chainTo: {
      name: "",
      image: "",
    },
    assetBridge: {
      symbol: "",
      image: "",
    },
    assetFrom: {
      symbol: "",
      image: "",
    },
    assetTo: {
      symbol: "",
      image: "",
      isAproximate: true,
    },
    fee: {
      estimatedFee: "0",
      estimatedTotal: "0",
    },
    swapId: "",
  });

  const [amounts, setAmounts] = useState({
    sell: "0",
    buy: "0",
  });

  const [minSellAmount, setMinSellAmount] = useState<string | null>(null);

  const [activeSwaps, setActiveSwaps] = useState<ActiveSwaps[]>([]);

  const [swapper, setSwapper] = useState<Swapper | null>(null);

  const [mustConfirmTx, setMustConfirmTx] = useState(false);

  const [sellBalanceError, setSellBalanceError] = useState<string | null>(null);

  const init = async (api: ApiPromise | ethers.providers.JsonRpcProvider) => {
    starLoading();
    try {
      const nativeCurrency = selectedChain!.symbol?.toLowerCase();
      const chainName = selectedChain!.name;

      const _swapper = new StealthEX();

      setTxInfo((prevState) => ({
        ...prevState,
        bridgeType: _swapper.type,
        bridgeName: _swapper.protocol,
        bridgeFee: _swapper.bridgeFee,
      }));

      const { nativeAssets, pairs } = await _swapper.init({
        nativeCurrency,
        chainName,
        api,
      });

      endLoading();
      setAssets([...nativeAssets]);
      setAssetToSell(nativeAssets[0]);
      setAssetsToSell(nativeAssets);
      setAssetsToBuy(pairs);
      setAssetToBuy(pairs[0]);
      setSwapper(_swapper);
    } catch (error) {
      showErrorToast("Error fetching assets");
      captureError(error);
      endLoading();
    }
  };

  const handleRecipientChange = (label: string, value: unknown) => {
    setRecipient((prevState) => ({
      ...prevState,
      [label]: value,
    }));
  };

  const handleAmounts = async (label: "sell" | "buy", value: string) => {
    try {
      setAmounts((prevState) => ({
        ...prevState,
        [label]: value,
      }));

      label === "sell" ? starLoadingBuyAsset() : starLoadingSellAsset();

      const { estimatedAmount, minAmount } = await swapper!.getEstimatedAmount({
        from: (assetToSell.symbol || "")?.toLowerCase(),
        to: (assetToBuy.symbol || "")?.toLowerCase(),
        amount: value,
      });

      setMinSellAmount(minAmount);

      setAmounts((prevState) => ({
        ...prevState,
        [label === "sell" ? "buy" : "sell"]: estimatedAmount,
      }));

      label === "sell" ? endLoadingBuyAsset() : endLoadingSellAsset();
    } catch (error) {
      showErrorToast("error_estimating_amount");
    }
  };

  const handleAssetChange = (label: "sell" | "buy", asset: SwapAsset) => {
    if (label === "sell") {
      setAssetToSell(asset);

      if (assetToBuy.symbol === asset.symbol) {
        setAssetToBuy(
          assetsToBuy.find((a) => a.symbol !== asset.symbol) as SwapAsset
        );
      }
    } else {
      setAssetToBuy(asset);

      if (assetToSell.symbol === asset.symbol) {
        setAssetToSell(
          assetsToSell.find((a) => a.symbol !== asset.symbol) as SwapAsset
        );
      }
    }
  };

  const setMaxAmout = () => {
    try {
      const amount = assetToSell.balance?.toString();
      const formatedAmount = formatBN(amount || "", assetToSell.decimals);

      setAmounts((prevState) => ({
        ...prevState,
        sell: formatedAmount,
      }));

      handleAmounts("sell", formatedAmount);
    } catch (error) {
      showErrorToast("error_setting_max_amount");
      captureError(error);
    }
  };

  const swap = async () => {
    starCreatingSwap();
    try {
      const { destination, fee, id } = await swapper!.createSwap({
        currencyFrom: assetToSell.symbol as string,
        currencyDecimals: assetToSell.decimals as number,
        currencyTo: assetToBuy.symbol as string,
        amountFrom: amounts.sell,
        addressFrom: selectedAccount.value.address,
        addressTo: recipient.address,
        nativeAsset: {
          symbol: selectedChain!.symbol,
          decimals: selectedChain!.decimals,
        },
        assetToSell: {
          symbol: assetToSell.label as string,
          decimals: assetToSell.decimals as number,
        },
      });

      const isNeededToConfirmTx = swapper!.mustConfirmTx();

      if (!isNeededToConfirmTx) {
        showSuccessToast("Swap successful");
        loadActiveSwaps();
        return;
      }

      const tx: Tx = {
        swapId: id,
        addressBridge: destination,
        addressFrom: selectedAccount.value.address,
        addressTo: recipient.address,
        amountFrom: amounts.sell,
        amountTo: amounts.buy,
        amountBridge: amounts.sell,
        chainFrom: {
          name: "",
          image: selectedChain!.logo,
        },
        chainBridge: {
          name: "",
          image: selectedChain!.logo,
        },
        chainTo: {
          name: "",
          image: assetToBuy.image || "",
        },
        assetFrom: {
          symbol: (assetToSell.label || "").toLocaleUpperCase(),
          image: assetToSell.image || "",
        },
        assetBridge: {
          symbol: (assetToSell.label || "").toLocaleUpperCase(),
          image: assetToSell.image || "",
        },
        assetTo: {
          symbol: (assetToBuy.label || "").toLocaleUpperCase(),
          image: assetToBuy.image || "",
          isAproximate: true,
        },
        fee,
      };
      setTx(tx);

      setMustConfirmTx(swapper!.mustConfirmTx());

      // clean amounts
      // setMinSellAmount(null);
      // setAmounts((prevState) => ({
      //   ...prevState,
      //   sell: "0",
      //   buy: "0",
      // }));
    } catch (error) {
      captureError(error);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      showErrorToast(error.response?.data?.message || error?.message || error);
    }

    endCreatingSwap();
  };

  const onBack = () => {
    setMustConfirmTx(false);
  };

  const loadActiveSwaps = async () => {
    starLoadingActiveSwaps();
    try {
      const activeSwaps = await swapper!.getActiveSwaps();
      setActiveSwaps(activeSwaps);
    } catch (error) {
      showErrorToast("error_fetching_swaps");
    }
    endLoadingActiveSwaps();
  };

  const onConfirmTx = async () => {
    if (!swapper) return;
    starLoading();
    try {
      const isConfirmNeeded = swapper.mustConfirmTx();

      if (isConfirmNeeded) {
        const assetToTransfer = _assets.find(
          (asset) => asset.symbol === assetToSell.label
        )!;

        // TODO: fix
        const { txHash, type } = await swapper.confirmTx({
          assetToTransfer: {
            id: assetToTransfer.id,
            address: assetToTransfer.address || "",
            decimals: assetToTransfer.decimals,
          },
          amount: amounts.sell,
          destinationAccount: tx.addressBridge,
        });

        if (type === AccountType.WASM) {
          await messageAPI.sendSubstrateTx({
            hexExtrinsic: txHash,
            amount: amounts.sell,
            asset: {
              id: assetToTransfer.id,
              symbol: assetToTransfer.symbol || "",
            },
            destinationAddress: tx.addressBridge,
            originAddress: selectedAccount.value.address,
            destinationNetwork: selectedChain?.name || "",
            networkName: selectedChain?.name || "",
            rpc: selectedChain?.rpcs[0] as string,
            isSwap: true,
          });
        } else {
          messageAPI.sendEvmTx({
            amount: amounts.sell,
            asset: {
              id: assetToTransfer.id,
              symbol: assetToTransfer.symbol || "",
            },
            destinationAddress: tx.addressBridge,
            originAddress: selectedAccount.value.address,
            destinationNetwork: selectedChain?.name || "",
            networkName: selectedChain?.name || "",
            rpc: selectedChain?.rpcs[0] as string,
            // @ts-expect-error -- *

            txHash,
            isSwap: true,
          });
        }

        showSuccessToast(t("tx_send"));
        // await swapper.saveSwapInStorage(tx.swapId);
        navigate(BALANCE, {
          state: {
            tab: "activity",
          },
        });
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _error: any = error;
      showErrorToast(
        _error?.body || _error?.error?.message || _error.message || error
      );
      captureError(error);
    }
    endLoading();
  };

  const isValidWASMAddress = useMemo(() => {
    const { address, isNotOwnAddress } = recipient;

    if (!isNotOwnAddress || !address.trim()) return true;

    try {
      decodeAddress(address);
      return true;
    } catch (error) {
      return false;
    }
  }, [recipient]);

  const balanceIsSufficient = useMemo(() => {
    let isSufficient = false;

    if (assetToSell?.balance) {
      const assetBalance = new BN(assetToSell.balance.toString());
      const amountBalance = transformAmountStringToBN(
        amounts.sell,
        assetToSell.decimals || 0
      );

      isSufficient = assetBalance.gte(amountBalance);
      !isSufficient && setSellBalanceError("insufficient_balance");
    }

    if (isSufficient && minSellAmount) {
      isSufficient =
        Number(amounts.sell) < Number(minSellAmount) ? false : true;
      !isSufficient && setSellBalanceError("min_amount_error");
    }

    isSufficient && setSellBalanceError(null);
    return isSufficient;
  }, [assetToSell?.balance, amounts?.sell, minSellAmount]);

  const showRecipientAddress = useMemo(() => {
    return swapper?.showRecipentAddressFormat();
  }, [swapper]);

  const swapInfoMessage = useMemo(() => {
    if (!swapper) return "";

    return swapper.swap_info || "";
  }, [swapper]);

  useEffect(() => {
    (async () => {
      if (amounts.sell !== "0") {
        handleAmounts("sell", amounts.sell);
      }

      if (_assets.length > 0) {
        const selectedAsset = _assets.find(
          (asset) => asset.symbol === assetToSell.label
        );

        if (!selectedAsset) return;

        setAssetToSell((prevState) => ({
          ...prevState,
          balance: selectedAsset.balance,
          decimals: selectedAsset.decimals,
        }));
      }
    })();
  }, [assetToSell?.label, _assets]);

  useEffect(() => {
    if (amounts.buy !== "0") {
      const canChangeSetAssetToSell = swapper!.canChangeSetAssetToSell();

      handleAmounts(
        canChangeSetAssetToSell ? "buy" : "sell",
        canChangeSetAssetToSell ? amounts.buy : amounts.sell
      );
    }
  }, [assetToBuy?.label]);

  useEffect(() => {
    if (!api) return;

    init(api);
  }, [api, _assets]);

  // useEffect(() => {
  //   if (!swapper) return;
  //   loadActiveSwaps();
  // }, [assets, swapper]);

  return {
    activeSwaps,
    amounts,
    assets,
    assetsToBuy,
    assetsToSell,
    assetToBuy,
    assetToSell,
    balanceIsSufficient,
    handleAmounts,
    handleAssetChange,
    handleRecipientChange,
    isCreatingSwap,
    isLoading,
    isLoadingActiveSwaps,
    isLoadingBuyAsset,
    isLoadingSellAsset,
    // isLoadingSellPairs,
    isValidWASMAddress,
    minSellAmount,
    mustConfirmTx,
    onBack,
    onConfirmTx,
    recipient,
    sellBalanceError,
    setAssetToBuy,
    setAssetToSell,
    setMaxAmout,
    showRecipientAddress,
    swap,
    swapInfoMessage,
    tx,
    txInfo,
  };
};
