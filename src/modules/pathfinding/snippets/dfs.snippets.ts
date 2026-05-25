// src/modules/pathfinding/snippets/dfs.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const dfsSnippets: CodeSnippets = {
  pseudocode: [
    'procedure DFS(grid, start, end)',
    '  stack = [start]; seen = {start}',
    '  while stack not empty',
    '    curr = stack.pop()',
    '    if curr == end: reconstruct path',
    '    for each neighbor of curr',
    '      if not seen and not wall: push',
  ],
  python: [
    'def dfs(grid, start, end):',
    '  stack = [start]',
    '  while stack:',
    '    curr = stack.pop()',
    '    if curr == end: return reconstruct()',
    '    for n in neighbors(curr):',
    '      if n not in seen and not wall(n): stack.append(n)',
  ],
  javascript: [
    'function dfs(grid, start, end) {',
    '  const stack = [start];',
    '  while (stack.length) {',
    '    const curr = stack.pop();',
    '    if (curr === end) return path();',
    '    for (const n of neighbors(curr))',
    '      if (!seen[n] && !wall(n)) stack.push(n);',
    '} }',
  ],
  lineMap: [],
}