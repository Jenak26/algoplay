// src/modules/graphs/snippets/prim.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const primSnippets: CodeSnippets = {
  pseudocode: [
    "Prim(Graph, start):",
    "  Initialize dist[v] = Infinity, inMST[v] = false",
    "  dist[start] = 0",
    "  While non-MST nodes exist:",
    "    u = node not in MST with min dist",
    "    inMST[u] = true",
    "    For each neighbor v of u not in MST:",
    "      If weight(u, v) < dist[v]:",
    "        dist[v] = weight(u, v)",
    "        parent[v] = u",
    "  EndWhile"
  ],
  python: [
    "def prim(graph, start):",
    "    dist = {v: float('inf') for v in graph}",
    "    dist[start] = 0",
    "    pq = [(0, start)]",
    "    in_mst = set()",
    "    while pq:",
    "        d, u = heapq.heappop(pq)",
    "        if u in in_mst: continue",
    "        in_mst.add(u)",
    "        for v, w in graph[u].items():",
    "            if v not in in_mst and w < dist[v]:",
    "                dist[v] = w",
    "                parent[v] = u",
    "                heapq.heappush(pq, (w, v))"
  ],
  javascript: [
    "function prim(graph, start) {",
    "  const dist = {};",
    "  for (const v in graph) dist[v] = Infinity;",
    "  dist[start] = 0;",
    "  const inMST = new Set();",
    "  const pq = new PriorityQueue();",
    "  pq.push(start, 0);",
    "  while (!pq.isEmpty()) {",
    "    const u = pq.pop();",
    "    inMST.add(u);",
    "    for (const [v, w] of graph[u]) {",
    "      if (!inMST.has(v) && w < dist[v]) {",
    "        dist[v] = w;",
    "        parent[v] = u;",
    "        pq.decreaseKey(v, w);",
    "      }",
    "    }",
    "  }",
    "}"
  ],
  lineMap: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
}
