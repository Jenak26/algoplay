// src/modules/graphs/algorithms/bfs.ts
import type { GraphInput } from '@/types/GraphModule'
import type { GraphStepRecorder } from '@/engine/GraphStepRecorder'


export function recordBFS(input: GraphInput, recorder: GraphStepRecorder): void {
  const { vertices, edges, startNode } = input
  if (vertices.length === 0) return

  const visited: Record<number, boolean> = {}
  const visitOrder: Record<number, number> = {}
  const parent: Record<number, number> = {}
  const distance: Record<number, number> = {}
  
  // Initialize
  for (const v of vertices) {
    distance[v.id] = Infinity
  }

  const queue: number[] = [startNode]
  visited[startNode] = true
  distance[startNode] = 0
  parent[startNode] = -1
  
  let step = 0
  visitOrder[startNode] = step++

  recorder.capture({
    vertices, edges, visited,
    activeNode: startNode,
    activeEdge: null,
    visitOrder, parent,
    path: [], queue, distance,
    codeLine: 1,
    description: `Initialize BFS from start node ${startNode}`
  })

  while (queue.length > 0) {
    const curr = queue.shift()!
    recorder.operation()

    recorder.capture({
      vertices, edges, visited,
      activeNode: curr,
      activeEdge: null,
      visitOrder, parent,
      path: [], queue, distance,
      codeLine: 4,
      description: `De-queued node ${curr} to expand its neighbors`
    })

    // Find all incident edges
    const incidentEdges = edges.filter(e => e.from === curr || e.to === curr)
    
    for (const edge of incidentEdges) {
      const neighbor = edge.from === curr ? edge.to : edge.from
      recorder.comparison()
      
      if (!visited[neighbor]) {
        visited[neighbor] = true
        visitOrder[neighbor] = step++
        parent[neighbor] = curr
        distance[neighbor] = distance[curr] + 1
        queue.push(neighbor)

        recorder.capture({
          vertices, edges, visited,
          activeNode: curr,
          activeEdge: edge,
          visitOrder, parent,
          path: [], queue, distance,
          codeLine: 8,
          description: `Discovered unvisited node ${neighbor} via edge (${curr} - ${neighbor})`
        })
      } else {
        recorder.capture({
          vertices, edges, visited,
          activeNode: curr,
          activeEdge: edge,
          visitOrder, parent,
          path: [], queue, distance,
          codeLine: 7,
          description: `Node ${neighbor} already visited, skipping edge`
        })
      }
    }
  }

  recorder.capture({
    vertices, edges, visited,
    activeNode: null,
    activeEdge: null,
    visitOrder, parent,
    path: [], queue, distance,
    codeLine: 11,
    description: 'BFS completed. All reachable nodes visited!'
  })
}
