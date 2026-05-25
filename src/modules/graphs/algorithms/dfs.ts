// src/modules/graphs/algorithms/dfs.ts
import type { GraphInput } from '@/types/GraphModule'
import type { GraphStepRecorder } from '@/engine/GraphStepRecorder'


export function recordDFS(input: GraphInput, recorder: GraphStepRecorder): void {
  const { vertices, edges, startNode } = input
  if (vertices.length === 0) return

  const visited: Record<number, boolean> = {}
  const visitOrder: Record<number, number> = {}
  const parent: Record<number, number> = {}
  const distance: Record<number, number> = {}
  
  for (const v of vertices) {
    distance[v.id] = Infinity
  }

  let step = 0
  const stack: number[] = []

  function dfs(curr: number, p: number, dist: number) {
    stack.push(curr)
    visited[curr] = true
    visitOrder[curr] = step++
    parent[curr] = p
    distance[curr] = dist
    recorder.operation()

    recorder.capture({
      vertices, edges, visited,
      activeNode: curr,
      activeEdge: null,
      visitOrder, parent,
      path: [], queue: [...stack], distance,
      codeLine: 4,
      description: `Enter DFS(${curr}). Active Stack: [${stack.join(', ')}]`
    })

    const incidentEdges = edges.filter(e => e.from === curr || e.to === curr)

    for (const edge of incidentEdges) {
      const neighbor = edge.from === curr ? edge.to : edge.from
      recorder.comparison()

      if (!visited[neighbor]) {
        recorder.capture({
          vertices, edges, visited,
          activeNode: curr,
          activeEdge: edge,
          visitOrder, parent,
          path: [], queue: [...stack], distance,
          codeLine: 7,
          description: `Discovered unvisited neighbor ${neighbor}, calling DFS(${neighbor})`
        })
        dfs(neighbor, curr, dist + 1)
      } else {
        recorder.capture({
          vertices, edges, visited,
          activeNode: curr,
          activeEdge: edge,
          visitOrder, parent,
          path: [], queue: [...stack], distance,
          codeLine: 8,
          description: `Neighbor ${neighbor} already visited, skipping edge`
        })
      }
    }

    stack.pop()
    recorder.capture({
      vertices, edges, visited,
      activeNode: curr,
      activeEdge: null,
      visitOrder, parent,
      path: [], queue: [...stack], distance,
      codeLine: 10,
      description: `Exit DFS(${curr}). Returning to parent node ${p === -1 ? 'None' : p}`
    })
  }

  dfs(startNode, -1, 0)

  recorder.capture({
    vertices, edges, visited,
    activeNode: null,
    activeEdge: null,
    visitOrder, parent,
    path: [], queue: [], distance,
    codeLine: 12,
    description: 'DFS completed. Stack unwound completely!'
  })
}
