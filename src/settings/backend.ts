import { GasPrice } from "@cosmjs/stargate";

export type NonEmptyArray<ElementType> = { readonly 0: ElementType } & readonly ElementType[];

export interface BackendSettings {
  readonly nodeUrls: NonEmptyArray<string>;
  readonly denominations: readonly string[];
  readonly addressPrefix: string;
  readonly gasPrice: GasPrice;
  readonly keplrChainInfo?: any;
  readonly contractsUrl?: string;
}

const devnetStargateSettings: BackendSettings = {
  nodeUrls: ["http://localhost:26659"],
  denominations: ["ucosm", "ustake"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const musselnetSettings: BackendSettings = {
  nodeUrls: ["https://rpc.musselnet.cosmwasm.com"],
  denominations: ["umayo", "ufrites"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const spacepussySettings: BackendSettings = {
  nodeUrls: ["https://rpc.space-pussy-1.cybernode.ai"],
  denominations: ["boot"],
  addressPrefix: "bostrom",
  gasPrice: GasPrice.fromString("0.01boot"),
  keplrChainInfo: {
    rpc: "https://rpc.space-pussy-1.cybernode.ai",
    rest: "https://lcd.space-pussy-1.cybernode.ai",
    chainId: "space-pussy-1",
    chainName: "Space Pussy",
    stakeCurrency: {
      coinDenom: "BOOT",
      coinMinimalDenom: "BOOT",
      coinDecimals: 0,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "bostrom",
      bech32PrefixAccPub: "bostrompub",
      bech32PrefixValAddr: "bostromvaloper",
      bech32PrefixValPub: "bostromvaloperpub",
      bech32PrefixConsAddr: "bostromvalcons",
      bech32PrefixConsPub: "bostromvalconspub",
    },
    currencies: [
      {
        coinDenom: "BOOT",
        coinMinimalDenom: "BOOT",
        coinDecimals: 0,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "BOOT",
        coinMinimalDenom: "BOOT",
        coinDecimals: 0,
      },
    ],
    features: ["stargate", "ibc-transfer", "cosmwasm"],
    explorerUrlToTx: "https://rebyc.cyber.page/network/bostrom/tx/{txHash}",
  },
};

const uniSettings: BackendSettings = {
  nodeUrls: ["https://rpc.juno.giansalex.dev"],
  denominations: ["ujunox"],
  addressPrefix: "juno",
  gasPrice: GasPrice.fromString("0.25ucosm"),
  keplrChainInfo: {
    rpc: "https://rpc.juno.giansalex.dev:443",
    rest: "https://lcd.juno.giansalex.dev:443",
    chainId: "uni",
    chainName: "Juno Testnet",
    stakeCurrency: {
      coinDenom: "JUNOX",
      coinMinimalDenom: "ujunox",
      coinDecimals: 6,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "juno",
      bech32PrefixAccPub: "junopub",
      bech32PrefixValAddr: "junovaloper",
      bech32PrefixValPub: "junovaloperpub",
      bech32PrefixConsAddr: "junovalcons",
      bech32PrefixConsPub: "junovalconspub",
    },
    currencies: [
      {
        coinDenom: "JUNOX",
        coinMinimalDenom: "ujunox",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "JUNOX",
        coinMinimalDenom: "ujunox",
        coinDecimals: 6,
      },
    ],
    features: ["stargate", "ibc-transfer", "cosmwasm", "no-legacy-stdTx"],
    explorerUrlToTx: "https://uni.junoscan.com/transactions/{txHash}",
    
  },
  contractsUrl: "https://graph.juno.giansalex.dev/api/rest/page"
};

const knownBackends: Partial<Record<string, BackendSettings>> = {
  devnetStargate: devnetStargateSettings,
  musselnet: musselnetSettings,
  spacepussy: spacepussySettings,
  uninet: uniSettings,
};

export function getCurrentBackend(): BackendSettings {
  const id = process.env.REACT_APP_BACKEND || "uninet";
  const backend = knownBackends[id];
  if (!backend) {
    throw new Error(`No backend found for the given ID "${id}"`);
  }
  return backend;
}
