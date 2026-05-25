// src/modules/pathfinding/snippets/astar.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const astarSnippets: CodeSnippets = {
  pseudocode: [
    'procedure AStar(grid, start, end)',
    '  g[start] = 0; f[start] = h(start, end)',
    '  open = {start}; closed = {}',
    '  while open not empty',
    '    curr = open with min f',
    '    if curr == end: reconstruct path',
    '    for each neighbor n of curr',
    '      tentative_g = g[curr] + weight(n)',
    '      if tentative_g < g[n]: update parents',
  ],
  python: [
    'def a_star(grid, start, end):',
    '  g = {start: 0}',
    '  f = {start: h(start, end)}',
    '  open = {start}',
    '  while open:',
    '    curr = min(open, key=f.get)',
    '    if curr == end: return reconstruct()',
    '    for n in neighbors(curr):',
    '      if g[curr] + w(n) < g.get(n, inf): update',
  ],
  javascript: [
    'function aStar(grid, start, end) {',
    '  const g = new Map([[start, 0]]);',
    '  const f = new Map([[start, h(start, end)]]);',
    '  const open = new Set([start]);',
    '  while (open.size) {',
    '    const curr = pickMinF(open, f);',
    '    if (curr === end) return path();',
    '    for (const n of neighbors(curr))',
    '      if (g.get(curr) + w(n) < (g.get(n) ?? Infinity)) update;',
    '} }',
  ],
  lineMap: [],
}
