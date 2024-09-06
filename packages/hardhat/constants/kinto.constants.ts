export const KintoSupportedChains = ['kinto'] as const
export type KintoSupportedChainsType = (typeof KintoSupportedChains)[number]
export const isKintoNetworkSupported = (network: string): network is KintoSupportedChainsType => {
  return KintoSupportedChains.includes(network as KintoSupportedChainsType)
}

export const KintoKYCViewerEndpointPerNetwork: Record<KintoSupportedChainsType, `0x${string}`> = {
  kinto: '0x33F28C3a636B38683a38987100723f2e2d3d038e',
}
