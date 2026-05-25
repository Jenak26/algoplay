// src/modules/trees/algorithms/insert.ts
import type { TreeInput } from '@/types/TreeModule'
import type { TreeStepRecorder } from '@/engine/TreeStepRecorder'
import type { TreeNode } from '@/types/TreeSnapshot'

export function recordInsert(input: TreeInput, recorder: TreeStepRecorder): void {
  const { nodes, rootId, valToOperate: val } = input
  if (val === undefined) return

  const activeNodes = nodes.map(n => ({ ...n }))
  
  if (rootId === null) {
    const rootNode: TreeNode = {
      id: 0, val, x: 0.5, y: 0.15,
      leftId: null, rightId: null, parentId: null
    }
    recorder.capture({
      nodes: [rootNode],
      activeNode: 0,
      visited: { 0: true },
      traversalOutput: [],
      pointers: { curr: 0, parent: null },
      activeEdge: null,
      queue: [],
      codeLine: 1,
      description: `Tree was empty. Inserted ${val} as root node.`
    })
    return
  }

  let currId: number | null = rootId
  let parentId: number | null = null

  recorder.capture({
    nodes: activeNodes,
    activeNode: rootId,
    visited: {},
    traversalOutput: [],
    pointers: { curr: rootId, parent: null },
    activeEdge: null,
    queue: [],
    codeLine: 0,
    description: `Start BST insertion for value ${val}. Compare with root.`
  })

  while (currId !== null) {
    const currNode = activeNodes.find(n => n.id === currId)!
    parentId = currId
    recorder.comparison()

    if (val < currNode.val) {
      currId = currNode.leftId
      if (currId !== null) {
        recorder.capture({
          nodes: activeNodes,
          activeNode: currId,
          visited: { [`${parentId}`]: true },
          traversalOutput: [],
          pointers: { curr: currId, parent: parentId },
          activeEdge: { from: parentId!, to: currId },
          queue: [],
          codeLine: 4,
          description: `${val} < ${currNode.val}. Traverse left.`
        })
      }
    } else {
      currId = currNode.rightId
      if (currId !== null) {
        recorder.capture({
          nodes: activeNodes,
          activeNode: currId,
          visited: { [`${parentId}`]: true },
          traversalOutput: [],
          pointers: { curr: currId, parent: parentId },
          activeEdge: { from: parentId!, to: currId },
          queue: [],
          codeLine: 6,
          description: `${val} >= ${currNode.val}. Traverse right.`
        })
      }
    }
  }

  // Insert the new node
  const parentNode = activeNodes.find(n => n.id === parentId)!
  const nextId = Math.max(...activeNodes.map(n => n.id), -1) + 1
  
  const parentLevel = Math.round((parentNode.y - 0.15) / 0.2)
  const childLevel = parentLevel + 1
  const childY = 0.15 + childLevel * 0.2
  
  const xOffset = 0.25 / Math.pow(2, childLevel)
  const childX = val < parentNode.val ? parentNode.x - xOffset : parentNode.x + xOffset

  const newNode: TreeNode = {
    id: nextId, val, x: childX, y: childY,
    leftId: null, rightId: null, parentId
  }

  if (val < parentNode.val) {
    parentNode.leftId = nextId
  } else {
    parentNode.rightId = nextId
  }

  activeNodes.push(newNode)
  recorder.operation()

  recorder.capture({
    nodes: activeNodes,
    activeNode: nextId,
    visited: { [`${parentId}`]: true },
    traversalOutput: [],
    pointers: { curr: nextId, parent: parentId },
    activeEdge: { from: parentId!, to: nextId },
    queue: [],
    codeLine: 9,
    description: `Inserted new node ${val} as child of parent ${parentNode.val}.`
  })
}
