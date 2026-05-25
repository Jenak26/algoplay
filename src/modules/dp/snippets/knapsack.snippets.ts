// src/modules/dp/snippets/knapsack.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const knapsackSnippets: CodeSnippets = {
  pseudocode: [
    "Knapsack(weights, values, W):",
    "  Initialize dp[N+1][W+1] with 0",
    "  For i = 1 to N:",
    "    For w = 1 to W:",
    "      If weights[i-1] <= w:",
    "        dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])",
    "      Else:",
    "        dp[i][w] = dp[i-1][w]",
    "  Return dp[N][W]"
  ],
  python: [
    "def knapsack(weights, values, W):",
    "    n = len(weights)",
    "    dp = [[0] * (W + 1) for _ in range(n + 1)]",
    "    for i in range(1, n + 1):",
    "        for w in range(1, W + 1):",
    "            if weights[i-1] <= w:",
    "                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])",
    "            else:",
    "                dp[i][w] = dp[i-1][w]",
    "    return dp[n][W]"
  ],
  javascript: [
    "function knapsack(weights, values, W) {",
    "  const n = weights.length;",
    "  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));",
    "  for (let i = 1; i <= n; i++) {",
    "    for (let w = 1; w <= W; w++) {",
    "      if (weights[i-1] <= w) {",
    "        dp[i][w] = Math.max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w]);",
    "      } else {",
    "        dp[i][w] = dp[i-1][w];",
    "      }",
    "    }",
    "  }",
    "  return dp[n][W];",
    "}"
  ],
  lineMap: [0, 1, 2, 3, 4, 5, 6, 7, 8]
}
