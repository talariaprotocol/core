export const PrivadoIdSupportedChains = ['polygonAmoy'] as const
export type PrivadoIdSupportedChainsType = (typeof PrivadoIdSupportedChains)[number]
export const isPrivadoIdNetworkSupported = (network: string): network is PrivadoIdSupportedChainsType => {
  return PrivadoIdSupportedChains.includes(network as PrivadoIdSupportedChainsType)
}

export const PrivadoIdEndpointPerNetwork: Record<PrivadoIdSupportedChainsType, `0x${string}`> = {
  polygonAmoy: '0x8c99F13dc5083b1E4c16f269735EaD4cFbc4970d',
}
