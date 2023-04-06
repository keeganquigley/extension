import { AccountType } from "@src/accounts/types";
import { Chain } from "@src/storage/entities/Chains";

const WASM = "WASM" as AccountType.WASM;
const EVM = "EVM" as AccountType.EVM;

export const MAINNETS: Chain[] = [
  {
    name: "Polkadot",
    rpc: { wasm: "wss://rpc.polkadot.io" },
    addressPrefix: 0,
    nativeCurrency: {
      name: "DOT",
      symbol: "DOT",
      decimals: 10,
    },
    logo: "polkadot",
    explorer: {
      wasm: {
        name: "subscan",
        url: "https://polkadot.subscan.io/",
      },
    },
    supportedAccounts: [WASM],
  },
  {
    name: "Kusama",
    rpc: { wasm: "wss://kusama-rpc.polkadot.io" },
    addressPrefix: 2,
    nativeCurrency: {
      name: "KSM",
      symbol: "KSM",
      decimals: 12,
    },
    logo: "kusama",
    explorer: {
      wasm: {
        name: "subscanß",
        url: "https://kusama.subscan.io/",
      },
    },
    supportedAccounts: [WASM],
  },
  {
    name: "Ethereum",
    rpc: { evm: "https://eth.llamarpc.com" },
    addressPrefix: 1,
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    explorer: {
      evm: {
        name: "etherscan",
        url: "https://etherscan.io/",
      },
    },
    logo: "ethereum",
    supportedAccounts: [EVM],
  },
  {
    name: "Astar",
    rpc: {
      evm: "https://evm.astar.network",
      wasm: "wss://rpc.astar.network",
    },
    addressPrefix: 5,
    nativeCurrency: {
      name: "Astar",
      symbol: "ASTR",
      decimals: 18,
    },
    explorer: {
      evm: {
        name: "subscan",
        url: "https://astar.subscan.io/",
      },
      wasm: {
        name: "subscan",
        url: "https://astar.subscan.io/",
      },
    },
    logo: "astar",
    supportedAccounts: [WASM, EVM],
  },
  {
    name: "Moonbeam",
    rpc: {
      evm: "https://rpc.api.moonbeam.network",
      wasm: "wss://wss.api.moonbeam.network",
    },
    addressPrefix: 1284,
    nativeCurrency: {
      name: "Glimmer",
      symbol: "GLMR",
      decimals: 18,
    },
    explorer: {
      evm: {
        name: "moonscan",
        url: "https://moonbeam.moonscan.io/",
      },
      wasm: {
        name: "moonscan",
        url: "https://moonbeam.moonscan.io/",
      },
    },
    logo: "moonbeam",
    supportedAccounts: [EVM, WASM],
  },

  {
    name: "Moonriver",
    rpc: {
      evm: "https://rpc.api.moonriver.moonbeam.network",
      wasm: "wss://wss.api.moonriver.moonbeam.network",
    },
    addressPrefix: 1284,
    nativeCurrency: {
      name: "Moonriver",
      symbol: "MOVR",
      decimals: 18,
    },

    explorer: {
      evm: {
        name: "moonscan",
        url: "https://moonriver.moonscan.io/",
      },
    },
    logo: "moonriver",
    supportedAccounts: [EVM],
  },
  {
    name: "Shiden",
    rpc: {
      evm: "https://evm.shiden.astar.network",
      wasm: "wss://shiden.api.onfinality.io/public-ws",
    },
    addressPrefix: 5,
    nativeCurrency: {
      name: "Shiden",
      symbol: "SDN",
      decimals: 18,
    },
    explorer: {
      evm: {
        name: "subscan",
        url: "https://shiden.subscan.io/",
      },
      wasm: {
        name: "subscan",
        url: "https://shiden.subscan.io/",
      },
    },
    logo: "shiden",
    supportedAccounts: [EVM, WASM],
  },
];

export const TESTNETS: Chain[] = [
  {
    name: "Moonbase Alpha",
    rpc: {
      evm: "https://rpc.api.moonbase.moonbeam.network",
      wasm: "wss://wss.api.moonbase.moonbeam.network",
    },
    addressPrefix: 1287,
    nativeCurrency: {
      name: "Dev",
      symbol: "DEV",
      decimals: 18,
    },
    explorer: {
      evm: {
        name: "moonscan",
        url: "https://moonbase.moonscan.io/",
      },
      wasm: {
        name: "moonscan",
        url: "https://moonbase.moonscan.io/",
      },
    },
    logo: "moonbeam",
    supportedAccounts: [EVM, WASM],
  },
  {
    name: "Shibuya",
    rpc: {
      evm: "https://evm.shibuya.astar.network",
      wasm: "wss://shibuya-rpc.dwellir.com",
    },
    nativeCurrency: {
      name: "shibuya",
      symbol: "SBY",
      decimals: 18,
    },
    addressPrefix: 5,

    explorer: {
      evm: {
        name: "subscan",
        url: "https://shibuya.subscan.io/",
      },
      wasm: {
        name: "subscan",
        url: "https://shibuya.subscan.io/",
      },
    },
    logo: "astar",
    supportedAccounts: [EVM, WASM],
  },
  {
    name: "Rococo",
    rpc: {
      wasm: "wss://rococo-rpc.polkadot.io",
    },
    addressPrefix: 42,

    nativeCurrency: {
      name: "roc",
      symbol: "ROC",
      decimals: 12,
    },
    explorer: {
      wasm: {
        name: "",
        url: "https://rococo.subscan.io/",
      },
    },
    logo: "rococo",
    supportedAccounts: [WASM],
  },

  {
    name: "Rococo contracts",
    rpc: {
      wasm: "wss://rococo-contracts-rpc.polkadot.io",
    },
    addressPrefix: 42,

    nativeCurrency: {
      name: "roc",
      symbol: "ROC",
      decimals: 12,
    },
    explorer: {
      wasm: {
        name: "",
        url: "https://rococo.subscan.io/",
      },
    },
    logo: "rococo",
    supportedAccounts: [WASM],
  },

  {
    name: "Rockmine",
    rpc: {
      wasm: "wss://rococo-rockmine-rpc.polkadot.io",
    },
    addressPrefix: 42,

    nativeCurrency: {
      name: "roc",
      symbol: "ROC",
      decimals: 12,
    },
    explorer: {
      wasm: {
        name: "",
        url: "https://rockmine.subscan.io/",
      },
    },
    logo: "rococo",
    supportedAccounts: [WASM],
  },
  {
    name: "Goerli",
    rpc: { evm: "https://goerli.infura.io/v3/" },
    addressPrefix: 5,
    nativeCurrency: {
      name: "GoerliETH",
      symbol: "GoerliETH",
      decimals: 18,
    },
    explorer: {
      evm: {
        name: "etherscan",
        url: "https://goerli.etherscan.io/",
      },
    },
    logo: "ethereum",
    supportedAccounts: [EVM],
  },

  // {
  //   name: "Relay",
  //   rpc: {
  //     wasm: "ws://127.0.0.1:9900/",
  //   },
  //   addressPrefix: 42,

  //   nativeCurrency: {
  //     name: "roc",
  //     symbol: "ROC",
  //     decimals: 12,
  //   },
  //   explorer: {
  //     wasm: {
  //       name: "",
  //       url: "",
  //     },
  //   },
  //   logo: "rococo",
  //   supportedAccounts: [WASM],
  // },
  // {
  //   name: "Parachain",
  //   rpc: {
  //     wasm: "ws://127.0.0.1:9920/",
  //   },
  //   addressPrefix: 42,

  //   nativeCurrency: {
  //     name: "roc",
  //     symbol: "ROC",
  //     decimals: 12,
  //   },
  //   explorer: {
  //     wasm: {
  //       name: "",
  //       url: "",
  //     },
  //   },
  //   logo: "rococo",
  //   supportedAccounts: [WASM],
  // },

  // {
  //   name: "Eth goerly alchemy",
  //   rpc: {
  //     evm: "https://eth-goerli.g.alchemy.com/v2/5_BItbroYpOXQnEhKDDFOoctfqifxjoH",
  //   },
  //   addressPrefix: 0,

  //   nativeCurrency: {
  //     name: "ETH",
  //     symbol: "ETH",
  //     decimals: 18,
  //   },
  //   explorer: {
  //     evm: {
  //       name: "",
  //       url: "https://goerli.etherscan.io/",
  //     },
  //   },
  //   logo: "rococo",
  //   supportedAccounts: [EVM],
  // },

  // {
  //   name: "Hadrhat",
  //   rpc: {
  //     evm: "http://localhost:8545",
  //   },
  //   addressPrefix: 0,

  //   nativeCurrency: {
  //     name: "HardhatETH",
  //     symbol: "HardhatETH",
  //     decimals: 18,
  //   },
  //   explorer: {
  //     evm: {
  //       name: "",
  //       url: "https://goerli.etherscan.io/",
  //     },
  //   },
  //   logo: "rococo",
  //   supportedAccounts: [EVM],
  // },
];

export const CHAINS = [
  {
    name: "mainnets",
    chains: MAINNETS,
  },
  {
    name: "testnets",
    chains: TESTNETS,
  },
];

export const DEFAULT_WASM_CHAIN = CHAINS[0].chains[0];
export const DEFAULT_EVM_CHAIN = CHAINS[0].chains[2];
