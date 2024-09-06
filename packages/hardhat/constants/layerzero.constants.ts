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
