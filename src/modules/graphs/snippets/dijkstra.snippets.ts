// src/modules/graphs/snippets/dijkstra.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const dijkstraSnippets: CodeSnippets = {
  pseudocode: [
    "Dijkstra(Graph, start):",
    "  Initialize dist[v] = Infinity, visited[v] = false",
    "  dist[start] = 0",
    "  While unvisited nodes exist:",
    "    u = unvisited node with min dist",
    "    mark u as visited",
    "    For each unvisited neighbor v of u:",
    "      alt = dist[u] + weight(u, v)",
    "      If alt < dist[v]:",
    "        dist[v] = alt",
    "        parent[v] = u",
    "  EndWhile"
  ],
  python: [
    "def dijkstra(graph, start):",
    "    dist = {v: float('inf') for v in graph}",
    "    dist[start] = 0",
    "    pq = [(0, start)]",
    "    while pq:",
    "        d, u = heapq.heappop(pq)",
    "        for v, w in graph[u].items():",
    "            alt = d + w",
    "            if alt < dist[v]:",
    "                dist[v] = alt",
    "                parent[v] = u",
    "                heapq.heappush(pq, (alt, v))"
  ],
  javascript: [
    "function dijkstra(graph, start) {",
    "  const dist = {};",
    "  for (const v in graph) dist[v] = Infinity;",
    "  dist[start] = 0;",
    "  const pq = new PriorityQueue();",
    "  pq.push(start, 0);",
    "  while (!pq.isEmpty()) {",
    "    const u = pq.pop();",
    "    for (const [v, w] of graph[u]) {",
    "      const alt = dist[u] + w;",
    "      if (alt < dist[v]) {",
    "        dist[v] = alt;",
    "        parent[v] = u;",
    "        pq.decreaseKey(v, alt);",
    "      }",
    "    }",
    "  }",
    "}"
  ],
  lineMap: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
}
