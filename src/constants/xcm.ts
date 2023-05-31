import { BN, numberToHex, u8aToHex } from "@polkadot/util";
import {
  KUSAMA_PARACHAINS,
  PARACHAINS,
  POLKADOT_PARACHAINS,
  RELAY_CHAINS,
} from "./chains";
import { decodeAddress } from "@polkadot/util-crypto";
import { BN0 } from "./assets";
import xTokensAbi from "@src/abi/xtokens_moonbeam_abi.json";
import { BigNumberish } from "ethers";

type Version = "V0" | "V1" | "V2" | "V3";

export const XCM = {
  pallets: {
    XCM_PALLET: {
      NAME: "xcmPallet",
      methods: {
        RESERVE_TRANSFER_ASSETS: "reserveTransferAssets",
        LIMITED_RESERVE_TRANSFER_ASSETS: "limitedReserveTransferAssets",
      },
    },
    POLKADOT_XCM: {
      NAME: "polkadotXcm",
      methods: {
        RESERVE_WITHDRAW_ASSETS: "reserveWithdrawAssets",
        RESERVE_TRANSFER_ASSETS: "reserveTransferAssets",
        LIMITED_RESERVE_TRANSFER_ASSETS: "limitedReserveTransferAssets",
      },
    },
    X_TOKENS: {
      NAME: "xTokens",
      methods: {
        TRANSFER: "transfer",
      },
    },
  },
};

export const getDest = ({
  parents = 0,
  parachainId = null,
  version = "V1",
}: {
  parents?: number;
  parachainId?: number | null;
  version?: Version;
}) => {
  return {
    [version]: {
      parents,
      interior: parachainId
        ? {
            X1: {
              Parachain: {
                id: parachainId,
              },
            },
          }
        : "Here",
    },
  };
};

export const getAssets = ({
  version = "V1",
  fungible = BN0,
  interior = "Here",
  parents = 0,
}: {
  version?: Version;
  fungible: BN | BigNumberish | string;
  interior?: "Here" | unknown;
  parents?: 0 | 1;
}) => {
  if (version === "V0") {
    return {
      V0: [
        {
          ConcreteFungible: {
            id: "Null",
            amount: fungible,
          },
        },
      ],
    };
  }

  return {
    [version]: [
      {
        id: {
          Concrete: {
            parents,
            interior,
          },
        },
        fun: {
          Fungible: fungible,
        },
      },
    ],
  };
};

interface ExtrinsicValues {
  address: string;
  amount: BN | BigNumberish | string;
  assetSymbol?: string;
}

const transformAddress = (address: string) => {
  const isHex = address.startsWith("0x");

  const accountId = isHex ? address : u8aToHex(decodeAddress(address));

  return {
    accountId,
  };
};

export const getBeneficiary = ({
  address = "",
  version = "V1",
  account = "AccountId32",
  parents = 0,
}) => {
  const { accountId } = transformAddress(address);

  const accountKey = account === "AccountId32" ? "id" : "key";

  return {
    [version]: {
      parents,
      interior: {
        X1: {
          [account]: {
            network: "Any",
            [accountKey]: accountId,
          },
        },
      },
    },
  };
};

export interface MapResponseXCM {
  pallet: string;
  method: string;
  extrinsicValues: {
    dest?: unknown;
    beneficiary?: unknown;
    assets?: unknown;
    feeAssetItem?: number;
    currencyId?: unknown;
    amount?: unknown | string;
    destWeightLimit?: string | { Limited: number };
  };
}

export interface MapResponseEVM {
  contractAddress: string;
  abi: string | unknown;
  method: string;
  extrinsicValues: {
    currency_address: string;
    amount: string;
    destination: unknown;
    weight: string;
  };
}

type Map = (props: ExtrinsicValues) => MapResponseXCM | MapResponseEVM;

interface IXCM_MAPPING {
  [key: string]: {
    [key: string]: Map;
  };
}

export const XCM_MAPPING: IXCM_MAPPING = {
  [RELAY_CHAINS.POLKADOT]: {
    [POLKADOT_PARACHAINS.ASTAR.name]: ({ address, amount }) => ({
      pallet: XCM.pallets.XCM_PALLET.NAME,
      method: XCM.pallets.XCM_PALLET.methods.RESERVE_TRANSFER_ASSETS,
      extrinsicValues: {
        dest: getDest({
          parachainId: POLKADOT_PARACHAINS.ASTAR.id,
        }) as unknown,
        beneficiary: getBeneficiary({
          address,
        }) as unknown,
        assets: getAssets({
          fungible: amount,
        }) as unknown,
        feeAssetItem: 0,
      },
    }),
    [POLKADOT_PARACHAINS.MOONBEAM.name]: ({ address, amount }) => ({
      pallet: XCM.pallets.XCM_PALLET.NAME,
      method: XCM.pallets.XCM_PALLET.methods.LIMITED_RESERVE_TRANSFER_ASSETS,
      extrinsicValues: {
        dest: getDest({
          parachainId: POLKADOT_PARACHAINS.MOONBEAM.id,
        }) as unknown,
        beneficiary: getBeneficiary({
          address,
          account: "AccountKey20",
        }) as unknown,
        assets: getAssets({
          fungible: amount,
          version: "V0",
        }) as unknown,
        feeAssetItem: 0,
        weightLimit: {
          Limited: 1_000_000_000,
        },
      },
    }),
    [POLKADOT_PARACHAINS.ACALA.name]: ({ address, amount }) => ({
      pallet: XCM.pallets.XCM_PALLET.NAME,
      method: XCM.pallets.XCM_PALLET.methods.LIMITED_RESERVE_TRANSFER_ASSETS,
      extrinsicValues: {
        dest: getDest({
          parachainId: POLKADOT_PARACHAINS.ACALA.id,
          version: "V0",
        }) as unknown,
        beneficiary: getBeneficiary({
          address,
          version: "V0",
        }) as unknown,
        assets: getAssets({
          fungible: amount,
          version: "V0",
        }) as unknown,
        feeAssetItem: 0,
      },
    }),
  },

  [RELAY_CHAINS.KUSAMA]: {
    [KUSAMA_PARACHAINS.MOONRIVER.name]: ({ address, amount }) => ({
      pallet: XCM.pallets.XCM_PALLET.NAME,
      method: XCM.pallets.XCM_PALLET.methods.LIMITED_RESERVE_TRANSFER_ASSETS,
      extrinsicValues: {
        dest: getDest({
          parachainId: KUSAMA_PARACHAINS.MOONRIVER.id,
          version: "V2",
        }) as unknown,
        beneficiary: getBeneficiary({
          address,
          account: "AccountKey20",
          version: "V2",
        }) as unknown,
        assets: getAssets({
          fungible: amount,
          version: "V2",
        }) as unknown,
        feeAssetItem: 0,
        weightLimit: "Unlimited",
      },
    }),

    [KUSAMA_PARACHAINS.SHIDEN.name]: ({ address, amount }) => ({
      pallet: XCM.pallets.XCM_PALLET.NAME,
      method: XCM.pallets.XCM_PALLET.methods.RESERVE_TRANSFER_ASSETS,
      extrinsicValues: {
        dest: getDest({
          parachainId: KUSAMA_PARACHAINS.SHIDEN.id,
          version: "V3",
        }) as unknown,
        beneficiary: getBeneficiary({
          address,
          version: "V3",
        }) as unknown,
        assets: getAssets({
          fungible: amount,
          version: "V3",
        }) as unknown,
        feeAssetItem: 0,
      },
    }),
  },

  [PARACHAINS.MOONBEAM]: {
    [RELAY_CHAINS.POLKADOT]: ({ address, amount }) => {
      const _address =
        "0x01" + u8aToHex(decodeAddress(address), undefined, false) + "00";

      return {
        contractAddress: "0x0000000000000000000000000000000000000804",
        abi: xTokensAbi,
        method: "transfer",
        extrinsicValues: {
          currency_address: "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080", //asset address
          amount: amount.toString(),
          destination: [1, [_address]] as unknown,
          weight: "4000000000", // Weight
        },
      };
    },

    [PARACHAINS.ASTAR]: ({ address, amount, assetSymbol }) => {
      const addressIsHex = address.startsWith("0x");

      const _address = addressIsHex
        ? "0x03" + address.slice(2) + "00"
        : "0x01" + u8aToHex(decodeAddress(address), undefined, false) + "00";

      let currency_address = "";

      switch (assetSymbol?.toLowerCase()) {
        case "glmr": {
          currency_address = "0x0000000000000000000000000000000000000802";
          break;
        }
        case "xcastr": {
          currency_address = "0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf";
          break;
        }
        default:
          throw new Error("Invalid asset symbol");
      }

      return {
        contractAddress: "0x0000000000000000000000000000000000000804",
        abi: xTokensAbi,
        method: "transfer",
        extrinsicValues: {
          currency_address, //asset address
          amount: amount.toString(),
          destination: [
            1,
            [
              "0x00" +
                "0000" +
                numberToHex(POLKADOT_PARACHAINS.ASTAR.id).split("0x")[1],
              _address,
            ],
          ],
          weight: "4000000000", // Weight
        },
      };
    },

    [PARACHAINS.ACALA]: ({ address, amount, assetSymbol }) => {
      const addressIsHex = address.startsWith("0x");

      const _address = addressIsHex
        ? "0x03" + address.slice(2) + "00"
        : "0x01" + u8aToHex(decodeAddress(address), undefined, false) + "00";

      let currency_address = "";

      switch (assetSymbol?.toLowerCase()) {
        case "glmr": {
          currency_address = "0x0000000000000000000000000000000000000802";
          break;
        }
        case "xcaca": {
          currency_address = "0xffffFFffa922Fef94566104a6e5A35a4fCDDAA9f";
          break;
        }
        default:
          throw new Error("Invalid asset symbol");
      }

      return {
        contractAddress: "0x0000000000000000000000000000000000000804",
        abi: xTokensAbi,
        method: "transfer",
        extrinsicValues: {
          currency_address, //asset address
          amount: amount.toString(),
          destination: [
            1,
            [
              "0x00" +
                "0000" +
                numberToHex(POLKADOT_PARACHAINS.ACALA.id).split("0x")[1],
              _address,
            ],
          ],
          weight: "4000000000", // Weight
        },
      };
    },
  },

  [PARACHAINS.ACALA]: {
    [RELAY_CHAINS.POLKADOT]: ({ address, amount }) => ({
      pallet: XCM.pallets.X_TOKENS.NAME,
      method: XCM.pallets.X_TOKENS.methods.TRANSFER,
      extrinsicValues: {
        currencyId: {
          Token: "DOT",
        },
        amount,
        dest: getBeneficiary({
          address,
          parents: 1,
        }),
        destWeightLimit: "Unlimited",
      },
    }),

    [PARACHAINS.ASTAR]: ({ address, amount, assetSymbol }) => {
      let currencyId = null;
      const destWeightLimit = "Unlimited";

      switch (assetSymbol?.toLowerCase()) {
        case "aca": {
          currencyId = {
            Token: "ACA",
          };
          break;
        }

        case "astr": {
          currencyId = {
            ForeignAsset: 2,
          };
          break;
        }
        default:
          throw new Error("Invalid asset symbol");
      }

      const { accountId } = transformAddress(address);

      return {
        pallet: XCM.pallets.X_TOKENS.NAME,
        method: XCM.pallets.X_TOKENS.methods.TRANSFER,
        extrinsicValues: {
          currencyId,
          amount,
          dest: {
            V1: {
              parents: 1,
              interior: {
                X2: [
                  {
                    Parachain: POLKADOT_PARACHAINS.ASTAR.id,
                  },
                  {
                    AccountId32: {
                      network: "Any",
                      id: accountId,
                    },
                  },
                ],
              },
            },
          },
          destWeightLimit,
        },
      };
    },

    [PARACHAINS.MOONBEAM]: ({ address, amount, assetSymbol }) => {
      let currencyId = null;
      let destWeightLimit: string | { Limited: number } = "Unlimited";

      switch (assetSymbol?.toLowerCase()) {
        case "aca": {
          currencyId = {
            Token: "ACA",
          };
          destWeightLimit = {
            Limited: 1_000_000_000,
          };
          break;
        }

        case "glmr": {
          currencyId = {
            ForeignAsset: 0,
          };
          break;
        }
        default:
          throw new Error("Invalid asset symbol");
      }

      const { accountId } = transformAddress(address);

      return {
        pallet: XCM.pallets.X_TOKENS.NAME,
        method: XCM.pallets.X_TOKENS.methods.TRANSFER,
        extrinsicValues: {
          currencyId,
          amount,
          dest: {
            V1: {
              parents: 1,
              interior: {
                X2: [
                  {
                    Parachain: POLKADOT_PARACHAINS.MOONBEAM.id,
                  },
                  {
                    AccountKey20: {
                      network: "Any",
                      key: accountId,
                    },
                  },
                ],
              },
            },
          } as unknown,
          destWeightLimit,
        },
      };
    },
  },

  [PARACHAINS.ASTAR]: {
    [RELAY_CHAINS.POLKADOT]: ({ address, amount }) => ({
      pallet: XCM.pallets.POLKADOT_XCM.NAME,
      method: XCM.pallets.POLKADOT_XCM.methods.RESERVE_WITHDRAW_ASSETS,
      extrinsicValues: {
        dest: getDest({
          parents: 1,
        }),
        beneficiary: getBeneficiary({
          address,
        }),
        assets: getAssets({
          fungible: amount,
          parents: 1,
        }),
        feeAssetItem: 0,
      },
    }),

    [PARACHAINS.MOONBEAM]: ({ address, amount, assetSymbol }) => {
      let assets = null;
      switch (assetSymbol?.toLowerCase()) {
        case "astr": {
          assets = getAssets({
            fungible: amount,
          });
          break;
        }
        case "glmr": {
          assets = getAssets({
            fungible: amount,
            interior: {
              X2: [
                {
                  Parachain: POLKADOT_PARACHAINS.MOONBEAM.id,
                },
                {
                  PalletInstance: 10,
                },
              ],
            },
          });
          break;
        }
        default:
          throw new Error("Invalid asset symbol");
      }
      return {
        pallet: XCM.pallets.POLKADOT_XCM.NAME,
        method:
          XCM.pallets.POLKADOT_XCM.methods.LIMITED_RESERVE_TRANSFER_ASSETS,
        extrinsicValues: {
          dest: getDest({
            parents: 1,
            parachainId: POLKADOT_PARACHAINS.MOONBEAM.id,
          }),
          beneficiary: getBeneficiary({
            address,
            account: "AccountKey20",
          }),
          assets,
          feeAssetItem: 0,
          weightLimit: "Unlimited",
        },
      };
    },

    [PARACHAINS.ACALA]: ({ address, amount, assetSymbol }) => {
      let assets = null;
      let method = null;

      switch (assetSymbol?.toLowerCase()) {
        case "astr": {
          method = XCM.pallets.XCM_PALLET.methods.RESERVE_TRANSFER_ASSETS;
          assets = getAssets({
            fungible: amount,
          });
          break;
        }
        case "aca": {
          method = XCM.pallets.POLKADOT_XCM.methods.RESERVE_WITHDRAW_ASSETS;
          assets = getAssets({
            fungible: amount,
            interior: {
              X2: [
                {
                  Parachain: POLKADOT_PARACHAINS.ACALA.id,
                },
                {
                  GeneralKey: "0x0000",
                },
              ],
            },
          });
          break;
        }
        default:
          throw new Error("Invalid asset symbol");
      }
      return {
        pallet: XCM.pallets.POLKADOT_XCM.NAME,
        method,
        extrinsicValues: {
          dest: getDest({
            parents: 1,
            parachainId: POLKADOT_PARACHAINS.ACALA.id,
          }),
          beneficiary: getBeneficiary({
            address,
          }),
          assets,
          feeAssetItem: 0,
        },
      };
    },
  },

  [PARACHAINS.MOONRIVER]: {
    [RELAY_CHAINS.KUSAMA]: ({ address, amount }) => {
      const _address =
        "0x01" + u8aToHex(decodeAddress(address), undefined, false) + "00";

      return {
        contractAddress: "0x0000000000000000000000000000000000000804",
        abi: xTokensAbi as unknown,
        method: "transfer",
        extrinsicValues: {
          currency_address: "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080", //asset address
          amount: amount.toString(),
          destination: [1, [_address]],
          weight: "4000000000", // Weight
        },
      };
    },

    [PARACHAINS.SHIDEN]: ({ address, amount, assetSymbol }) => {
      const addressIsHex = address.startsWith("0x");

      const _address = addressIsHex
        ? "0x03" + address.slice(2) + "00"
        : "0x01" + u8aToHex(decodeAddress(address), undefined, false) + "00";

      let currency_address = "";

      switch (assetSymbol?.toLowerCase()) {
        case "movr": {
          currency_address = "0x0000000000000000000000000000000000000802";
          break;
        }
        case "xcsdn": {
          currency_address = "0xFFFfffFF0Ca324C842330521525E7De111F38972";
          break;
        }
        default:
          throw new Error("Invalid asset symbol");
      }

      return {
        contractAddress: "0x0000000000000000000000000000000000000804",
        abi: xTokensAbi as unknown,
        method: "transfer",
        extrinsicValues: {
          currency_address, //asset address
          amount: amount.toString(),
          destination: [
            1,
            [
              "0x00" +
                "0000" +
                numberToHex(POLKADOT_PARACHAINS.ASTAR.id).split("0x")[1],
              _address,
            ],
          ],
          weight: "4000000000", // Weight
        },
      };
    },
  },

  [PARACHAINS.SHIDEN]: {
    [RELAY_CHAINS.KUSAMA]: ({ address, amount }) => ({
      pallet: XCM.pallets.POLKADOT_XCM.NAME,
      method: XCM.pallets.POLKADOT_XCM.methods.RESERVE_WITHDRAW_ASSETS,
      extrinsicValues: {
        dest: getDest({
          parents: 1,
          version: "V3",
        }),
        beneficiary: getBeneficiary({
          address,
          version: "V3",
        }),
        assets: getAssets({
          fungible: amount,
          parents: 1,
          version: "V3",
        }),
        feeAssetItem: 0,
      },
    }),

    [PARACHAINS.MOONRIVER]: ({ address, amount, assetSymbol }) => {
      let method = null;
      let assets = null;
      let weightLimit = null;
      let version: Version | null = null;

      switch (assetSymbol?.toLowerCase()) {
        case "sdn": {
          version = "V2";
          method =
            XCM.pallets.POLKADOT_XCM.methods.LIMITED_RESERVE_TRANSFER_ASSETS;

          assets = getAssets({
            fungible: amount,
            version,
          });

          weightLimit = "Unlimited";

          break;
        }
        case "movr": {
          version = "V3";
          method = XCM.pallets.POLKADOT_XCM.methods.RESERVE_WITHDRAW_ASSETS;

          assets = getAssets({
            fungible: amount,
            version,
            parents: 1,
            interior: {
              X2: [
                {
                  Parachain: KUSAMA_PARACHAINS.MOONRIVER.id,
                },
                {
                  PalletInstance: 10,
                },
              ],
            },
          });

          break;
        }
        default:
          throw new Error("Invalid asset symbol");
      }

      return {
        pallet: XCM.pallets.POLKADOT_XCM.NAME,
        method,
        extrinsicValues: {
          dest: getDest({
            parents: 1,
            parachainId: KUSAMA_PARACHAINS.MOONRIVER.id,
            version,
          }),
          beneficiary: getBeneficiary({
            address,
            account: "AccountKey20",
            version,
          }),
          assets,
          feeAssetItem: 0,
          weightLimit,
        },
      };
    },
  },
};

interface IXCM_ASSETS_MAPPING {
  [key: string]: {
    [key: string]: string[];
  };
}

export const XCM_ASSETS_MAPPING: IXCM_ASSETS_MAPPING = {
  [PARACHAINS.MOONBEAM]: {
    [RELAY_CHAINS.POLKADOT]: ["xcDOT"],
    [PARACHAINS.ASTAR]: ["GLMR", "xcASTR"],
    [PARACHAINS.ACALA]: ["GLMR", "xcACA"],
  },
  [PARACHAINS.ASTAR]: {
    [RELAY_CHAINS.POLKADOT]: ["DOT"],
    [PARACHAINS.MOONBEAM]: ["ASTR", "GLMR"],
    [PARACHAINS.ACALA]: ["ASTR", "ACA"],
  },
  [PARACHAINS.ACALA]: {
    [RELAY_CHAINS.POLKADOT]: ["DOT"],
    [PARACHAINS.ASTAR]: ["ACA", "ASTR"],
    [PARACHAINS.MOONBEAM]: ["ACA", "GLMR"],
  },
  [PARACHAINS.MOONRIVER]: {
    [RELAY_CHAINS.KUSAMA]: ["xcKSM"],
    [PARACHAINS.SHIDEN]: ["MOVR", "xcSDN"],
  },
  [PARACHAINS.SHIDEN]: {
    [RELAY_CHAINS.KUSAMA]: ["KSM"],
    [PARACHAINS.MOONRIVER]: ["SDN", "MOVR"],
  },
};
