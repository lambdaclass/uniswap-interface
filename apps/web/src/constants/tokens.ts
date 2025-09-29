import { ChainId, Currency, NativeCurrency, Token, UNI_ADDRESSES, WETH9 } from '@uniswap/sdk-core'
import invariant from 'tiny-invariant'

// eslint-disable-next-line no-restricted-syntax
export const NATIVE_CHAIN_ID = 'NATIVE'

export const TEST_ETHREX = new Token(
  ChainId.ETHREX,
  '0xB66dd10F098f62141A536e92f6e8f7f9633893E2',
  18,
  'TEST',
  'TEST token'
)

export const WETH_ETHREX = new Token(
  ChainId.ETHREX,
  '0xec7ed8038b76dbcb8f78b189eff9d7c7373a45be',
  18,
  'WETH',
  'Wrapped Ether'
)

export const UNI: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, UNI_ADDRESSES[ChainId.MAINNET], 18, 'UNI', 'Uniswap'),
  [ChainId.GOERLI]: new Token(ChainId.GOERLI, UNI_ADDRESSES[ChainId.GOERLI], 18, 'UNI', 'Uniswap'),
  [ChainId.SEPOLIA]: new Token(ChainId.SEPOLIA, UNI_ADDRESSES[ChainId.SEPOLIA], 18, 'UNI', 'Uniswap'),
}

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } = {
  ...(WETH9 as Record<ChainId, Token>),
  [ChainId.ETHREX]: WETH_ETHREX
}


export function isEthrex(chainId: number): chainId is ChainId.ETHREX {
  return chainId === ChainId.ETHREX
}

class EthrexNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isEthrex(this.chainId)) throw new Error('Not Ethrex')
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    invariant(wrapped instanceof Token)
    return wrapped
  }

  public constructor(chainId: number) {
    if (!isEthrex(chainId)) throw new Error('Not Ethrex')
    super(chainId, 18, 'ETH', 'ETH')
  }
}

class ExtendedEther extends NativeCurrency {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error(`Unsupported chain ID: ${this.chainId}`)
  }

  protected constructor(chainId: number) {
    super(chainId, 18, 'ETH', 'Ethereum')
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {}
export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId]
  let nativeCurrency: NativeCurrency | Token

  if (isEthrex(chainId)) {
    nativeCurrency = new EthrexNativeCurrency(chainId)
  } else {
    nativeCurrency = ExtendedEther.onChain(chainId)
  }
  return (cachedNativeCurrency[chainId] = nativeCurrency)
}

export const TOKEN_SHORTHANDS: { [shorthand: string]: { [chainId in ChainId]?: string } } = {
  USDC: {

  },
  USDT: {

  },
}

const STABLECOINS: { [chainId in ChainId]: Token[] } = {
  [ChainId.MAINNET]: [],
  [ChainId.ARBITRUM_ONE]: [],
  [ChainId.ARBITRUM_GOERLI]: [],
  [ChainId.OPTIMISM]: [],
  [ChainId.OPTIMISM_GOERLI]: [],
  [ChainId.POLYGON]: [],
  [ChainId.POLYGON_MUMBAI]: [],
  [ChainId.BNB]: [],
  [ChainId.BASE]: [],
  [ChainId.CELO]: [],
  [ChainId.CELO_ALFAJORES]: [],
  [ChainId.GOERLI]: [],
  [ChainId.SEPOLIA]: [],
  [ChainId.AVALANCHE]: [],
  [ChainId.GNOSIS]: [],
  [ChainId.MOONBEAM]: [],
  [ChainId.BASE_GOERLI]: [],
  [ChainId.OPTIMISM_SEPOLIA]: [],
  [ChainId.ARBITRUM_SEPOLIA]: [],
  [ChainId.ETHREX]: [],
}

export function isStablecoin(currency?: Currency): boolean {
  if (!currency) return false

  return STABLECOINS[currency.chainId as ChainId].some((stablecoin) => stablecoin.equals(currency))
}
