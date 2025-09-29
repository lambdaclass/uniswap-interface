// a list of tokens by chain
import { ChainId, Currency, Token, WETH9 } from '@uniswap/sdk-core'

import {
  TEST_ETHREX,
  WETH_ETHREX,
  WRAPPED_NATIVE_CURRENCY,
  nativeOnChain,
} from './tokens'

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

type ChainCurrencyList = {
  readonly [chainId: number]: Currency[]
}

const WRAPPED_NATIVE_CURRENCIES_ONLY: ChainTokenList = Object.fromEntries(
  Object.entries(WRAPPED_NATIVE_CURRENCY)
    .map(([key, value]) => [key, [value]])
    .filter(Boolean)
)

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainCurrencyList = {
  [ChainId.ETHREX]: [
    nativeOnChain(ChainId.ETHREX),
    TEST_ETHREX,
    WETH_ETHREX
  ]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_CURRENCIES_ONLY,
  [ChainId.ETHREX]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[ChainId.ETHREX],
    TEST_ETHREX,
    WETH_ETHREX
  ]
}
export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [ChainId.ETHREX]: [],
}
