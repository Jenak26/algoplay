// src/modules/graphs/algorithms/dijkstra.ts
import type { GraphInput } from '@/types/GraphModule'
import type { GraphStepRecorder } from '@/engine/GraphStepRecorder'


export function recordDijkstra(input: GraphInput, recorder: GraphStepRecorder): void {
  const { vertices, edges, startNode } = input
  if (vertices.length === 0) return

  const visited: Record<number, boolean> = {}
  const visitOrder: Record<number, number> = {}
  const parent: Record<number, number> = {}
  const distance: Record<number, number> = {}
  
  // Initialize
  for (const v of vertices) {
    distance[v.id] = Infinity
    visited[v.id] = false
  }
  distance[startNode] = 0
  parent[startNode] = -1

  let step = 0

  // Set of unvisited node IDs
  const unvisitedNodes = vertices.map(v => v.id)

  while (unvisitedNodes.length > 0) {
    // Find vertex with minimum distance among unvisited
    unvisitedNodes.sort((a, b) => distance[a] - distance[b])
    const curr = unvisitedNodes[0]
    
    // If smallest distance is Infinity, remaining nodes are unreachable
    if (distance[curr] === Infinity) {
      break
    }

    // Extract current node
    unvisitedNodes.shift()
    visited[curr] = true
    visitOrder[curr] = step++
    recorder.operation()

    recorder.capture({
      vertices, edges, visited,
      activeNode: curr,
      activeEdge: null,
      visitOrder, parent,
      path: [], queue: [...unvisitedNodes], distance,
      codeLine: 4,
      description: `Selected node ${curr} with minimum distance ${distance[curr]}`
    })

    // Relax all neighbors
    const incidentEdges = edges.filter(e => e.from === curr || e.to === curr)

    for (const edge of incidentEdges) {
      const neighbor = edge.from === curr ? edge.to : edge.from
      if (visited[neighbor]) continue
      
      recorder.comparison()
      const newDist = distance[curr] + edge.weight

      if (newDist < distance[neighbor]) {
        distance[neighbor] = newDist
        parent[neighbor] = curr

        recorder.capture({
          vertices, edges, visited,
          activeNode: curr,
          activeEdge: edge,
          visitOrder, parent,
          path: [], queue: [...unvisitedNodes], distance,
          codeLine: 8,
          description: `Relaxed edge (${curr} - ${neighbor}). New distance to ${neighbor} is ${newDist}`
        })
      } else {
        recorder.capture({
          vertices, edges, visited,
          activeNode: curr,
          activeEdge: edge,
          visitOrder, parent,
          path: [], queue: [...unvisitedNodes], distance,
          codeLine: 7,
          description: `Edge (${curr} - ${neighbor}) does not yield a shorter path (cost ${newDist} >= ${distance[neighbor]})`
        })
      }
    }
  }

  // Find the node with the maximum finite distance to reconstruct a demo path
  let maxNode = startNode
  let maxDist = 0
  for (const idStr in distance) {
    const id = Number(idStr)
    if (distance[id] !== Infinity && distance[id] > maxDist) {
      maxDist = distance[id]
      maxNode = id
    }
  }

  const path: number[] = []
  if (maxNode !== startNode) {
    let temp = maxNode
    while (temp !== -1) {
      path.unshift(temp)
      temp = parent[temp] ?? -1
    }
  }

  recorder.capture({
    vertices, edges, visited,
    activeNode: null,
    activeEdge: null,
    visitOrder, parent,
    path, queue: [], distance,
    codeLine: 11,
    description: `Dijkstra completed. Path of max cost highlights: [${path.join(' -> ')}]`
  })
}
