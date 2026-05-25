// src/test/modules/graphs/algorithms.test.ts
import { describe, it, expect } from 'vitest'
import { GraphStepRecorder } from '@/engine/GraphStepRecorder'
import { recordBFS } from '@/modules/graphs/algorithms/bfs'
import { recordDFS } from '@/modules/graphs/algorithms/dfs'
import { recordDijkstra } from '@/modules/graphs/algorithms/dijkstra'
import { recordPrim } from '@/modules/graphs/algorithms/prim'
import type { Vertex, Edge } from '@/types/GraphSnapshot'

const testVertices: Vertex[] = [
  { id: 0, label: 'A', x: 0.1, y: 0.1 },
  { id: 1, label: 'B', x: 0.5, y: 0.1 },
  { id: 2, label: 'C', x: 0.9, y: 0.1 }
]

const testEdges: Edge[] = [
  { from: 0, to: 1, weight: 2 },
  { from: 1, to: 2, weight: 3 }
]

describe('Graph Algorithms', () => {
  it('BFS traversal visits all reachable nodes', () => {
    const r = new GraphStepRecorder()
    recordBFS({ vertices: testVertices, edges: testEdges, startNode: 0 }, r)
    const steps = r.getSteps()
    expect(steps.length).toBeGreaterThan(0)
    const lastStep = steps.at(-1)!
    expect(lastStep.visited[0]).toBe(true)
    expect(lastStep.visited[1]).toBe(true)
    expect(lastStep.visited[2]).toBe(true)
  })

  it('DFS traversal visits all reachable nodes and tracks stack depth', () => {
    const r = new GraphStepRecorder()
    recordDFS({ vertices: testVertices, edges: testEdges, startNode: 0 }, r)
    const steps = r.getSteps()
    expect(steps.length).toBeGreaterThan(0)
    const lastStep = steps.at(-1)!
    expect(lastStep.visited[0]).toBe(true)
    expect(lastStep.visited[1]).toBe(true)
    expect(lastStep.visited[2]).toBe(true)
  })

  it('Dijkstra finds shortest path correctly', () => {
    const r = new GraphStepRecorder()
    recordDijkstra({ vertices: testVertices, edges: testEdges, startNode: 0 }, r)
    const steps = r.getSteps()
    expect(steps.length).toBeGreaterThan(0)
    const lastStep = steps.at(-1)!
    expect(lastStep.distance[2]).toBe(5) // Path cost 2 + 3 = 5
  })

  it('Prim MST correctly spanning tree', () => {
    const r = new GraphStepRecorder()
    recordPrim({ vertices: testVertices, edges: testEdges, startNode: 0 }, r)
    const steps = r.getSteps()
    expect(steps.length).toBeGreaterThan(0)
    const lastStep = steps.at(-1)!
    expect(lastStep.visited[2]).toBe(true)
  })
})
