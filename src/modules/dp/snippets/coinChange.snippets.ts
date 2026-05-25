// src/modules/dp/snippets/coinChange.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const coinChangeSnippets: CodeSnippets = {
  pseudocode: [
    "CoinChange(coins, amount):",
    "  Initialize dp[N+1][amount+1] with INF, where dp[i][0]=0",
    "  For i = 1 to N:",
    "    For j = 1 to amount:",
    "      If coins[i-1] <= j:",
    "        dp[i][j] = min(dp[i-1][j], 1 + dp[i][j-coins[i-1]])",
    "      Else:",
    "        dp[i][j] = dp[i-1][j]",
    "  Return dp[N][amount]"
  ],
  python: [
    "def coin_change(coins, amount):",
    "    n = len(coins)",
    "    dp = [[float('inf')] * (amount + 1) for _ in range(n + 1)]",
    "    for i in range(n + 1): dp[i][0] = 0",
    "    for i in range(1, n + 1):",
    "        for j in range(1, amount + 1):",
    "            if coins[i-1] <= j:",
    "                dp[i][j] = min(dp[i-1][j], 1 + dp[i][j-coins[i-1]])",
    "            else:",
    "                dp[i][j] = dp[i-1][j]",
    "    return dp[n][amount]"
  ],
  javascript: [
    "function coinChange(coins, amount) {",
    "  const n = coins.length;",
    "  const dp = Array.from({ length: n + 1 }, () => Array(amount + 1).fill(Infinity));",
    "  for (let i = 0; i <= n; i++) dp[i][0] = 0;",
    "  for (let i = 1; i <= n; i++) {",
    "    for (let j = 1; j <= amount; j++) {",
    "      if (coins[i-1] <= j) {",
    "        dp[i][j] = Math.min(dp[i-1][j], 1 + dp[i][j-coins[i-1]]);",
    "      } else {",
    "        dp[i][j] = dp[i-1][j];",
    "      }",
    "    }",
    "  }",
    "  return dp[n][amount];",
    "}"
  ],
  lineMap: [0, 1, 2, 3, 4, 5, 6, 7, 8]
}
