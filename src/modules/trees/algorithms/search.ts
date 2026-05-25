// src/modules/trees/algorithms/search.ts
import type { TreeInput } from '@/types/TreeModule'
import type { TreeStepRecorder } from '@/engine/TreeStepRecorder'

export function recordSearch(input: TreeInput, recorder: TreeStepRecorder): void {
  const { nodes, rootId, valToOperate: val } = input
  if (val === undefined || rootId === null) return

  const activeNodes = nodes.map(n => ({ ...n }))
  const visited: Record<number, boolean> = {}

  let currId: number | null = rootId
  let parentId: number | null = null

  recorder.capture({
    nodes: activeNodes,
    activeNode: rootId,
    visited,
    traversalOutput: [],
    pointers: { curr: rootId },
    activeEdge: null,
    queue: [],
    codeLine: 0,
    description: `Start searching for value ${val}. Compare with root.`
  })

  while (currId !== null) {
    const currNode = activeNodes.find(n => n.id === currId)!
    visited[currId] = true
    recorder.comparison()

    if (currNode.val === val) {
      recorder.capture({
        nodes: activeNodes,
        activeNode: currId,
        visited,
        traversalOutput: [],
        pointers: { curr: currId },
        activeEdge: parentId !== null ? { from: parentId, to: currId } : null,
        queue: [],
        codeLine: 3,
        description: `Value ${val} found at node ${currNode.val}!`
      })
      return
    }

    parentId = currId
    if (val < currNode.val) {
      currId = currNode.leftId
      if (currId !== null) {
        recorder.capture({
          nodes: activeNodes,
          activeNode: currId,
          visited,
          traversalOutput: [],
          pointers: { curr: currId },
          activeEdge: { from: parentId!, to: currId },
          queue: [],
          codeLine: 6,
          description: `${val} < ${currNode.val}. Search left subtree.`
        })
      }
    } else {
      currId = currNode.rightId
      if (currId !== null) {
        recorder.capture({
          nodes: activeNodes,
          activeNode: currId,
          visited,
          traversalOutput: [],
          pointers: { curr: currId },
          activeEdge: { from: parentId!, to: currId },
          queue: [],
          codeLine: 8,
          description: `${val} >= ${currNode.val}. Search right subtree.`
        })
      }
    }
  }

  recorder.capture({
    nodes: activeNodes,
    activeNode: null,
    visited,
    traversalOutput: [],
    pointers: { curr: null },
    activeEdge: null,
    queue: [],
    codeLine: 10,
    description: `Search completed. Value ${val} not found in the BST.`
  })
}
