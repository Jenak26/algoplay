// src/modules/graphs/snippets/bfs.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const bfsSnippets: CodeSnippets = {
  pseudocode: [
    "BFS(Graph, startNode):",
    "  Initialize queue Q with [startNode]",
    "  Mark startNode as visited",
    "  While Q is not empty:",
    "    u = Q.dequeue()",
    "    For each neighbor v of u:",
    "      If v is not visited:",
    "        Mark v as visited",
    "        parent[v] = u",
    "        Q.enqueue(v)",
    "  EndWhile"
  ],
  python: [
    "def bfs(graph, start):",
    "    queue = collections.deque([start])",
    "    visited = {start}",
    "    while queue:",
    "        u = queue.popleft()",
    "        for v in graph[u]:",
    "            if v not in visited:",
    "                visited.add(v)",
    "                parent[v] = u",
    "                queue.append(v)"
  ],
  javascript: [
    "function bfs(graph, start) {",
    "  const queue = [start];",
    "  const visited = new Set([start]);",
    "  while (queue.length > 0) {",
    "    const u = queue.shift();",
    "    for (const v of graph[u]) {",
    "      if (!visited.has(v)) {",
    "        visited.add(v);",
    "        parent[v] = u;",
    "        queue.push(v);",
    "      }",
    "    }",
    "  }",
    "}"
  ],
  lineMap: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
