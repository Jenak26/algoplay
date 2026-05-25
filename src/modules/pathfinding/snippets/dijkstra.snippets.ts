// src/modules/pathfinding/snippets/dijkstra.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const dijkstraSnippets: CodeSnippets = {
  pseudocode: [
    'procedure Dijkstra(grid, start, end)',
    '  dist[v] = inf for all; dist[start] = 0',
    '  while unvisited remain',
    '    curr = unvisited with min dist',
    '    for each neighbor n of curr',
    '      alt = dist[curr] + weight(n)',
    '      if alt < dist[n]: dist[n] = alt',
    '  reconstruct path from parents',
  ],
  python: [
    'def dijkstra(grid, start, end):',
    '  dist = {v: inf for v in grid}; dist[start] = 0',
    '  while unvisited:',
    '    curr = min(unvisited, key=dist.get)',
    '    for n in neighbors(curr):',
    '      alt = dist[curr] + weight(n)',
    '      if alt < dist[n]: dist[n] = alt',
    '  return path',
  ],
  javascript: [
    'function dijkstra(grid, start, end) {',
    '  const dist = Array(n).fill(Infinity); dist[start] = 0;',
    '  while (unvisited.size) {',
    '    const curr = pickMin(unvisited, dist);',
    '    for (const n of neighbors(curr)) {',
    '      const alt = dist[curr] + weight(n);',
    '      if (alt < dist[n]) dist[n] = alt;',
    '} } return path; }',
  ],
  lineMap: [],
}