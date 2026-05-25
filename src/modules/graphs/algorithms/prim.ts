// src/modules/graphs/algorithms/prim.ts
import type { GraphInput } from '@/types/GraphModule'
import type { GraphStepRecorder } from '@/engine/GraphStepRecorder'


export function recordPrim(input: GraphInput, recorder: GraphStepRecorder): void {
  const { vertices, edges, startNode } = input
  if (vertices.length === 0) return

  const visited: Record<number, boolean> = {}
  const visitOrder: Record<number, number> = {}
  const parent: Record<number, number> = {}
  const distance: Record<number, number> = {} // tracks minimum edge weight to connect to MST
  
  // Initialize
  for (const v of vertices) {
    distance[v.id] = Infinity
    visited[v.id] = false
  }
  distance[startNode] = 0
  parent[startNode] = -1

  let step = 0
  const unvisited = vertices.map(v => v.id)

  recorder.capture({
    vertices, edges, visited,
    activeNode: startNode,
    activeEdge: null,
    visitOrder, parent,
    path: [], queue: [...unvisited], distance,
    codeLine: 1,
    description: `Initialize Prim's MST starting from node ${startNode}`
  })

  while (unvisited.length > 0) {
    // Find node with minimum distance (edge weight connection to MST) among unvisited
    unvisited.sort((a, b) => distance[a] - distance[b])
    const curr = unvisited[0]

    if (distance[curr] === Infinity) {
      break // Graph is disconnected
    }

    // Extract current node and add to MST
    unvisited.shift()
    visited[curr] = true
    visitOrder[curr] = step++
    recorder.operation()

    const incomingEdge = edges.find(e => 
      (e.from === curr && e.to === parent[curr]) || 
      (e.to === curr && e.from === parent[curr])
    )

    recorder.capture({
      vertices, edges, visited,
      activeNode: curr,
      activeEdge: incomingEdge ?? null,
      visitOrder, parent,
      path: [], queue: [...unvisited], distance,
      codeLine: 4,
      description: `Added node ${curr} to MST${parent[curr] !== -1 ? ` via edge (${parent[curr]} - ${curr}) with weight ${distance[curr]}` : ''}`
    })

    // Check neighbors of newly added vertex
    const incidentEdges = edges.filter(e => e.from === curr || e.to === curr)

    for (const edge of incidentEdges) {
      const neighbor = edge.from === curr ? edge.to : edge.from
      if (visited[neighbor]) continue

      recorder.comparison()
      
      if (edge.weight < distance[neighbor]) {
        distance[neighbor] = edge.weight
        parent[neighbor] = curr

        recorder.capture({
          vertices, edges, visited,
          activeNode: curr,
          activeEdge: edge,
          visitOrder, parent,
          path: [], queue: [...unvisited], distance,
          codeLine: 8,
          description: `Updated minimum edge to neighbor ${neighbor} to weight ${edge.weight} (via node ${curr})`
        })
      }
    }
  }

  // Populate path with vertices that are part of the MST
  const mstNodes = vertices.map(v => v.id).filter(id => visited[id])

  recorder.capture({
    vertices, edges, visited,
    activeNode: null,
    activeEdge: null,
    visitOrder, parent,
    path: mstNodes, queue: [], distance,
    codeLine: 11,
    description: "Prim's MST algorithm completed. Spanning tree highlighted!"
  })
}
