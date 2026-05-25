// src/modules/pathfinding/index.ts
import type { PathfindingModule } from '@/types/PathfindingModule'
import { GridRenderer } from './GridRenderer'
import { recordBFS }      from './algorithms/bfs'
import { recordDFS }      from './algorithms/dfs'
import { recordDijkstra } from './algorithms/dijkstra'
import { recordAStar }    from './algorithms/astar'
import { bfsSnippets }      from './snippets/bfs.snippets'
import { dfsSnippets }      from './snippets/dfs.snippets'
import { dijkstraSnippets } from './snippets/dijkstra.snippets'
import { astarSnippets }    from './snippets/astar.snippets'
import { generateRandomWalls }       from './mazes/randomWalls'
import { generateRecursiveDivision } from './mazes/recursiveDivision'
import { generatePrimMaze }          from './mazes/prim'

export const pathfindingModule: PathfindingModule = {
  id:            'pathfinding',
  name:          'Pathfinding',
  icon:          'P',
  route:         '/pathfinding',
  defaultAlgoId: 'bfs',
  defaultGrid:   { width: 31, height: 21 },
  Renderer:      GridRenderer,
  algorithms: [
    {
      id: 'bfs', name: 'Breadth-First Search',
      timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
      spaceComplexity: 'O(V)', weighted: false,
      record: recordBFS, codeSnippets: bfsSnippets,
    },
    {
      id: 'dfs', name: 'Depth-First Search',
      timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
      spaceComplexity: 'O(V)', weighted: false,
      record: recordDFS, codeSnippets: dfsSnippets,
    },
    {
      id: 'dijkstra', name: 'Dijkstra',
      timeComplexity: { best: 'O(V^2)', average: 'O(V^2)', worst: 'O(V^2)' },
      spaceComplexity: 'O(V)', weighted: true,
      record: recordDijkstra, codeSnippets: dijkstraSnippets,
    },
    {
      id: 'astar', name: 'A*',
      timeComplexity: { best: 'O(E)', average: 'O(E log V)', worst: 'O(V^2)' },
      spaceComplexity: 'O(V)', weighted: true,
      record: recordAStar, codeSnippets: astarSnippets,
    },
  ],
  mazes: [
    { id: 'random',    name: 'Random Walls',       generate: (w, h) => generateRandomWalls(w, h, 0.3) },
    { id: 'recursive', name: 'Recursive Division', generate: generateRecursiveDivision },
    { id: 'prim',      name: "Prim's Maze",        generate: generatePrimMaze },
  ],
}
