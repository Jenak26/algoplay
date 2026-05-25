// src/modules/trees/algorithms/traverse.ts
import type { TreeInput } from '@/types/TreeModule'
import type { TreeStepRecorder } from '@/engine/TreeStepRecorder'

export function recordInorder(input: TreeInput, recorder: TreeStepRecorder): void {
  const { nodes, rootId } = input
  if (rootId === null) return

  const activeNodes = nodes.map(n => ({ ...n }))
  const visited: Record<number, boolean> = {}
  const output: number[] = []
  const stack: number[] = []

  function traverse(currId: number | null, pId: number | null) {
    if (currId === null) return

    const node = activeNodes.find(n => n.id === currId)!
    stack.push(currId)
    recorder.operation()

    recorder.capture({
      nodes: activeNodes,
      activeNode: currId,
      visited,
      traversalOutput: [...output],
      pointers: { curr: currId },
      activeEdge: pId !== null ? { from: pId, to: currId } : null,
      queue: [...stack],
      codeLine: 2,
      description: `Traverse left subtree of node ${node.val}. Stack: [${stack.map(id => activeNodes.find(n => n.id === id)?.val).join(', ')}]`
    })

    traverse(node.leftId, currId)

    // Back to current node
    visited[currId] = true
    output.push(node.val)
    recorder.operation()

    recorder.capture({
      nodes: activeNodes,
      activeNode: currId,
      visited,
      traversalOutput: [...output],
      pointers: { curr: currId },
      activeEdge: null,
      queue: [...stack],
      codeLine: 4,
      description: `Visited node ${node.val}. Added to output list.`
    })

    recorder.capture({
      nodes: activeNodes,
      activeNode: currId,
      visited,
      traversalOutput: [...output],
      pointers: { curr: currId },
      activeEdge: node.rightId !== null ? { from: currId, to: node.rightId } : null,
      queue: [...stack],
      codeLine: 6,
      description: `Traverse right subtree of node ${node.val}.`
    })

    traverse(node.rightId, currId)

    stack.pop()
    recorder.capture({
      nodes: activeNodes,
      activeNode: currId,
      visited,
      traversalOutput: [...output],
      pointers: { curr: currId },
      activeEdge: null,
      queue: [...stack],
      codeLine: 8,
      description: `Finished processing node ${node.val}. Unwinding recursion stack.`
    })
  }

  traverse(rootId, null)

  recorder.capture({
    nodes: activeNodes,
    activeNode: null,
    visited,
    traversalOutput: [...output],
    pointers: { curr: null },
    activeEdge: null,
    queue: [],
    codeLine: 9,
    description: `Inorder traversal completed. Output sequence: [${output.join(', ')}]`
  })
}

export function recordPreorder(input: TreeInput, recorder: TreeStepRecorder): void {
  const { nodes, rootId } = input
  if (rootId === null) return

  const activeNodes = nodes.map(n => ({ ...n }))
  const visited: Record<number, boolean> = {}
  const output: number[] = []
  const stack: number[] = []

  function traverse(currId: number | null, pId: number | null) {
    if (currId === null) return

    const node = activeNodes.find(n => n.id === currId)!
    stack.push(currId)
    visited[currId] = true
    output.push(node.val)
    recorder.operation()

    recorder.capture({
      nodes: activeNodes,
      activeNode: currId,
      visited,
      traversalOutput: [...output],
      pointers: { curr: currId },
      activeEdge: pId !== null ? { from: pId, to: currId } : null,
      queue: [...stack],
      codeLine: 2,
      description: `Visit node ${node.val} immediately (Pre-order). Added to output. Stack: [${stack.map(id => activeNodes.find(n => n.id === id)?.val).join(', ')}]`
    })

    recorder.capture({
      nodes: activeNodes,
      activeNode: currId,
      visited,
      traversalOutput: [...output],
      pointers: { curr: currId },
      activeEdge: node.leftId !== null ? { from: currId, to: node.leftId } : null,
      queue: [...stack],
      codeLine: 4,
      description: `Traverse left subtree of node ${node.val}.`
    })

    traverse(node.leftId, currId)

    recorder.capture({
      nodes: activeNodes,
      activeNode: currId,
      visited,
      traversalOutput: [...output],
      pointers: { curr: currId },
      activeEdge: node.rightId !== null ? { from: currId, to: node.rightId } : null,
      queue: [...stack],
      codeLine: 6,
      description: `Traverse right subtree of node ${node.val}.`
    })

    traverse(node.rightId, currId)

    stack.pop()
  }

  traverse(rootId, null)

  recorder.capture({
    nodes: activeNodes,
    activeNode: null,
    visited,
    traversalOutput: [...output],
    pointers: { curr: null },
    activeEdge: null,
    queue: [],
    codeLine: 9,
    description: `Preorder traversal completed. Output sequence: [${output.join(', ')}]`
  })
}

export function recordPostorder(input: TreeInput, recorder: TreeStepRecorder): void {
  const { nodes, rootId } = input
  if (rootId === null) return

  const activeNodes = nodes.map(n => ({ ...n }))
  const visited: Record<number, boolean> = {}
  const output: number[] = []
  const stack: number[] = []

  function traverse(currId: number | null, pId: number | null) {
    if (currId === null) return

    const node = activeNodes.find(n => n.id === currId)!
    stack.push(currId)
    recorder.operation()

    recorder.capture({
      nodes: activeNodes,
      activeNode: currId,
      visited,
      traversalOutput: [...output],
      pointers: { curr: currId },
      activeEdge: pId !== null ? { from: pId, to: currId } : null,
      queue: [...stack],
      codeLine: 2,
      description: `Traverse left subtree of node ${node.val}. Stack: [${stack.map(id => activeNodes.find(n => n.id === id)?.val).join(', ')}]`
    })

    traverse(node.leftId, currId)

    recorder.capture({
      nodes: activeNodes,
      activeNode: currId,
      visited,
      traversalOutput: [...output],
      pointers: { curr: currId },
      activeEdge: node.rightId !== null ? { from: currId, to: node.rightId } : null,
      queue: [...stack],
      codeLine: 4,
      description: `Traverse right subtree of node ${node.val}.`
    })

    traverse(node.rightId, currId)

    // Visit after traversing both subtrees
    visited[currId] = true
    output.push(node.val)
    recorder.operation()

    recorder.capture({
      nodes: activeNodes,
      activeNode: currId,
      visited,
      traversalOutput: [...output],
      pointers: { curr: currId },
      activeEdge: null,
      queue: [...stack],
      codeLine: 6,
      description: `Visited node ${node.val} (Post-order). Added to output.`
    })

    stack.pop()
  }

  traverse(rootId, null)

  recorder.capture({
    nodes: activeNodes,
    activeNode: null,
    visited,
    traversalOutput: [...output],
    pointers: { curr: null },
    activeEdge: null,
    queue: [],
    codeLine: 9,
    description: `Postorder traversal completed. Output sequence: [${output.join(', ')}]`
  })
}
