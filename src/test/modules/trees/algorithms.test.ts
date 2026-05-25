// src/test/modules/trees/algorithms.test.ts
import { describe, it, expect } from 'vitest'
import { TreeStepRecorder } from '@/engine/TreeStepRecorder'
import { recordInsert } from '@/modules/trees/algorithms/insert'
import { recordSearch } from '@/modules/trees/algorithms/search'
import { recordInorder } from '@/modules/trees/algorithms/traverse'
import type { TreeNode } from '@/types/TreeSnapshot'

describe('BST operations and traversals', () => {
  const initialNodes: TreeNode[] = [
    { id: 0, val: 50, x: 0.5, y: 0.15, parentId: null, leftId: null, rightId: null }
  ]

  it('BST insert inserts smaller values to left and larger to right', () => {
    const r1 = new TreeStepRecorder()
    recordInsert({ nodes: initialNodes, rootId: 0, valToOperate: 30 }, r1)
    const steps1 = r1.getSteps()
    const last1 = steps1.at(-1)!
    expect(last1.nodes.length).toBe(2)
    const parentNode = last1.nodes.find(n => n.id === 0)!
    expect(parentNode.leftId).not.toBeNull()

    const r2 = new TreeStepRecorder()
    recordInsert({ nodes: last1.nodes, rootId: 0, valToOperate: 70 }, r2)
    const steps2 = r2.getSteps()
    const last2 = steps2.at(-1)!
    expect(last2.nodes.length).toBe(3)
    const parentNode2 = last2.nodes.find(n => n.id === 0)!
    expect(parentNode2.rightId).not.toBeNull()
  })

  it('BST search finds elements in tree', () => {
    const nodes: TreeNode[] = [
      { id: 0, val: 50, x: 0.5, y: 0.15, parentId: null, leftId: 1, rightId: null },
      { id: 1, val: 30, x: 0.25, y: 0.35, parentId: 0, leftId: null, rightId: null }
    ]
    const r = new TreeStepRecorder()
    recordSearch({ nodes, rootId: 0, valToOperate: 30 }, r)
    const steps = r.getSteps()
    const last = steps.at(-1)!
    expect(last.activeNode).toBe(1) // node with value 30
  })

  it('Inorder traversal visits L, Root, R', () => {
    const nodes: TreeNode[] = [
      { id: 0, val: 50, x: 0.5, y: 0.15, parentId: null, leftId: 1, rightId: 2 },
      { id: 1, val: 30, x: 0.25, y: 0.35, parentId: 0, leftId: null, rightId: null },
      { id: 2, val: 70, x: 0.75, y: 0.35, parentId: 0, leftId: null, rightId: null }
    ]
    const r = new TreeStepRecorder()
    recordInorder({ nodes, rootId: 0 }, r)
    const last = r.getSteps().at(-1)!
    expect(last.traversalOutput).toEqual([30, 50, 70])
  })
})
