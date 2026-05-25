// src/modules/pathfinding/snippets/bfs.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const bfsSnippets: CodeSnippets = {
  pseudocode: [
    'procedure BFS(grid, start, end)',
    '  queue = [start]; seen = {start}',
    '  while queue not empty',
    '    curr = queue.shift()',
    '    if curr == end: reconstruct path',
    '    for each neighbor of curr',
    '      if not seen and not wall: enqueue',
  ],
  python: [
    'def bfs(grid, start, end):',
    '  queue = deque([start])',
    '  while queue:',
    '    curr = queue.popleft()',
    '    if curr == end: return reconstruct()',
    '    for n in neighbors(curr):',
    '      if n not in seen and not wall(n): queue.append(n)',
  ],
  javascript: [
    'function bfs(grid, start, end) {',
    '  const queue = [start];',
    '  while (queue.length) {',
    '    const curr = queue.shift();',
    '    if (curr === end) return path();',
    '    for (const n of neighbors(curr))',
    '      if (!seen[n] && !wall(n)) queue.push(n);',
    '} }',
  ],
  lineMap: [],
}