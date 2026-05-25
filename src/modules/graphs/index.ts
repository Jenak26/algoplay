// src/modules/graphs/index.ts
import type { GraphModule } from '@/types/GraphModule'
import { GraphRenderer } from './GraphRenderer'
import { recordBFS } from './algorithms/bfs'
import { recordDFS } from './algorithms/dfs'
import { recordDijkstra } from './algorithms/dijkstra'
import { recordPrim } from './algorithms/prim'
import { bfsSnippets } from './snippets/bfs.snippets'
import { dfsSnippets } from './snippets/dfs.snippets'
import { dijkstraSnippets } from './snippets/dijkstra.snippets'
import { primSnippets } from './snippets/prim.snippets'

export const graphsModule: GraphModule = {
  id:            'graphs',
  name:          'Graphs',
  icon:          '🕸',
  route:         '/graphs',
  Renderer:      GraphRenderer,
  defaultAlgoId: 'bfs',
  algorithms: [
    {
      id: 'bfs',
      name: 'Breadth-First Search',
      timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
      spaceComplexity: 'O(V)',
      record: recordBFS,
      codeSnippets: bfsSnippets
    },
    {
      id: 'dfs',
      name: 'Depth-First Search',
      timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
      spaceComplexity: 'O(V)',
      record: recordDFS,
      codeSnippets: dfsSnippets
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Shortest Path",
      timeComplexity: { best: 'O(V^2)', average: 'O(E log V)', worst: 'O(V^2)' },
      spaceComplexity: 'O(V)',
      record: recordDijkstra,
      codeSnippets: dijkstraSnippets
    },
    {
      id: 'prim',
      name: "Prim's MST",
      timeComplexity: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(V^2)' },
      spaceComplexity: 'O(V)',
      record: recordPrim,
      codeSnippets: primSnippets
    }
  ]
}
