// src/modules/dp/snippets/lcs.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const lcsSnippets: CodeSnippets = {
  pseudocode: [
    "LCS(strA, strB):",
    "  Initialize dp[N+1][M+1] with 0",
    "  For i = 1 to N:",
    "    For j = 1 to M:",
    "      If strA[i-1] == strB[j-1]:",
    "        dp[i][j] = dp[i-1][j-1] + 1",
    "      Else:",
    "        dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
    "  Return dp[N][M]"
  ],
  python: [
    "def lcs(strA, strB):",
    "    n, m = len(strA), len(strB)",
    "    dp = [[0] * (m + 1) for _ in range(n + 1)]",
    "    for i in range(1, n + 1):",
    "        for j in range(1, m + 1):",
    "            if strA[i-1] == strB[j-1]:",
    "                dp[i][j] = dp[i-1][j-1] + 1",
    "            else:",
    "                dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
    "    return dp[n][m]"
  ],
  javascript: [
    "function lcs(strA, strB) {",
    "  const n = strA.length, m = strB.length;",
    "  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));",
    "  for (let i = 1; i <= n; i++) {",
    "    for (let j = 1; j <= m; j++) {",
    "      if (strA[i-1] === strB[j-1]) {",
    "        dp[i][j] = dp[i-1][j-1] + 1;",
    "      } else {",
    "        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);",
    "      }",
    "    }",
    "  }",
    "  return dp[n][m];",
    "}"
  ],
  lineMap: [0, 1, 2, 3, 4, 5, 6, 7, 8]
}
