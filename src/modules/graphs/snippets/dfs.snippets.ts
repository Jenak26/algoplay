// src/modules/graphs/snippets/dfs.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const dfsSnippets: CodeSnippets = {
  pseudocode: [
    "DFS(Graph, startNode):",
    "  Mark startNode as visited",
    "  For each neighbor v of startNode:",
    "    If v is not visited:",
    "      parent[v] = startNode",
    "      DFS(Graph, v)",
    "    EndIf",
    "  EndFor"
  ],
  python: [
    "def dfs(graph, u, visited=None):",
    "    if visited is None: visited = set()",
    "    visited.add(u)",
    "    for v in graph[u]:",
    "        if v not in visited:",
    "            parent[v] = u",
    "            dfs(graph, v, visited)"
  ],
  javascript: [
    "function dfs(graph, u, visited = new Set()) {",
    "  visited.add(u);",
    "  for (const v of graph[u]) {",
    "    if (!visited.has(v)) {",
    "      parent[v] = u;",
    "      dfs(graph, v, visited);",
    "    }",
    "  }",
    "}"
  ],
  lineMap: [0, 1, 2, 3, 4, 5, 6, 7]
}
