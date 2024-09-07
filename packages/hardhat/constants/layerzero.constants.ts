export const LayerZeroSupportedChains = [
  'sepolia',
  'arbitrumSepolia',
  'optimismSepolia',
  'avalancheFuji',
  'polygonAmoy',
  'morphHolesky',
  'baseSepolia',
  'zkSyncSepolia',
] as const
export type LayerZeroSupportedChainsType = (typeof LayerZeroSupportedChains)[number]
export const isLayerZeroNetworkSupported = (network: string): network is LayerZeroSupportedChainsType => {
  return LayerZeroSupportedChains.includes(network as LayerZeroSupportedChainsType)
}

export const LayerZeroEndpointPerNetwork: Record<LayerZeroSupportedChainsType, `0x${string}`> = {
  sepolia: '0x6EDCE65403992e310A62460808c4b910D972f10f',
  arbitrumSepolia: '0x6EDCE65403992e310A62460808c4b910D972f10f',
  optimismSepolia: '0x6EDCE65403992e310A62460808c4b910D972f10f',
  avalancheFuji: '0x6EDCE65403992e310A62460808c4b910D972f10f',
  polygonAmoy: '0x6EDCE65403992e310A62460808c4b910D972f10f',
  morphHolesky: '0x6EDCE65403992e310A62460808c4b910D972f10f',
  baseSepolia: '0x6EDCE65403992e310A62460808c4b910D972f10f',
  zkSyncSepolia: '0xe2Ef622A13e71D9Dd2BBd12cd4b27e1516FA8a09',
}

export const LayerZeroSendLibraryPerNetwork: Record<LayerZeroSupportedChainsType, `0x${string}`> = {
  sepolia: '0xcc1ae8Cf5D3904Cef3360A9532B477529b177cCE',
  arbitrumSepolia: '0x4f7cd4DA19ABB31b0eC98b9066B9e857B1bf9C0E',
  optimismSepolia: '0xB31D2cb502E25B30C651842C7C3293c51Fe6d16f',
  avalancheFuji: '0x69BF5f48d2072DfeBc670A1D19dff91D0F4E8170',
  polygonAmoy: '0x1d186C560281B8F1AF831957ED5047fD3AB902F9',
  morphHolesky: '0x1d186C560281B8F1AF831957ED5047fD3AB902F9',
  baseSepolia: '0xC1868e054425D378095A003EcbA3823a5D0135C9',
  zkSyncSepolia: '0xaF862837316E00d2708Bd648c5FE87EdC7093799',
}

export const LayerZeroReceiveLibraryPerNetwork: Record<LayerZeroSupportedChainsType, `0x${string}`> = {
  sepolia: '0xdAf00F5eE2158dD58E0d3857851c432E34A3A851',
  arbitrumSepolia: '0x75Db67CDab2824970131D5aa9CECfC9F69c69636',
  optimismSepolia: '0x9284fd59B95b9143AF0b9795CAC16eb3C723C9Ca',
  avalancheFuji: '0x819F0FAF2cb1Fba15b9cB24c9A2BDaDb0f895daf',
  polygonAmoy: '0x53fd4C4fBBd53F6bC58CaE6704b92dB1f360A648',
  morphHolesky: '0x53fd4C4fBBd53F6bC58CaE6704b92dB1f360A648',
  baseSepolia: '0x12523de19dc41c91F7d2093E0CFbB76b17012C8d',
  zkSyncSepolia: '0x5c123dB6f87CC0d7e320C5CC9EaAfD336B5f6eF3',
}

export const EIDsPerNetwork: Record<LayerZeroSupportedChainsType, string> = {
  sepolia: "40161",
  arbitrumSepolia: "40231",
  optimismSepolia: "40232",
  avalancheFuji: "40106",
  polygonAmoy: "40267",
  morphHolesky: "40290",
  baseSepolia: "40245",
  zkSyncSepolia: "40305",
}
