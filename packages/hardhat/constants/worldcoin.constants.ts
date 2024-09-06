export const WorldcoinSupportedChains = ['optimismSepolia'] as const
export type WorldcoinSupportedChainsType = (typeof WorldcoinSupportedChains)[number]
export const isWorldcoinNetworkSupported = (network: string): network is WorldcoinSupportedChainsType => {
  return WorldcoinSupportedChains.includes(network as WorldcoinSupportedChainsType)
}

export const WorldcoinEndpointPerNetwork: Record<WorldcoinSupportedChainsType, `0x${string}`> = {
  optimismSepolia: '0x11cA3127182f7583EfC416a8771BD4d11Fae4334',
}
