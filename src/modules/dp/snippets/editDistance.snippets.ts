// src/modules/dp/snippets/editDistance.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const editDistanceSnippets: CodeSnippets = {
  pseudocode: [
    "EditDistance(strA, strB):",
    "  Initialize dp[N+1][M+1] where dp[i][0]=i, dp[0][j]=j",
    "  For i = 1 to N:",
    "    For j = 1 to M:",
    "      If strA[i-1] == strB[j-1]:",
    "        dp[i][j] = dp[i-1][j-1]",
    "      Else:",
    "        dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])",
    "  Return dp[N][M]"
  ],
  python: [
    "def edit_distance(strA, strB):",
    "    n, m = len(strA), len(strB)",
    "    dp = [[0] * (m + 1) for _ in range(n + 1)]",
    "    for i in range(n + 1): dp[i][0] = i",
    "    for j in range(m + 1): dp[0][j] = j",
    "    for i in range(1, n + 1):",
    "        for j in range(1, m + 1):",
    "            if strA[i-1] == strB[j-1]:",
    "                dp[i][j] = dp[i-1][j-1]",
    "            else:",
    "                dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])",
    "    return dp[n][m]"
  ],
  javascript: [
    "function editDistance(strA, strB) {",
    "  const n = strA.length, m = strB.length;",
    "  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));",
    "  for (let i = 0; i <= n; i++) dp[i][0] = i;",
    "  for (let j = 0; j <= m; j++) dp[0][j] = j;",
    "  for (let i = 1; i <= n; i++) {",
    "    for (let j = 1; j <= m; j++) {",
    "      if (strA[i-1] === strB[j-1]) {",
    "        dp[i][j] = dp[i-1][j-1];",
    "      } else {",
    "        dp[i][j] = 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);",
    "      }",
    "    }",
    "  }",
    "  return dp[n][m];",
    "}"
  ],
  lineMap: [0, 1, 2, 3, 4, 5, 6, 7, 8]
}
