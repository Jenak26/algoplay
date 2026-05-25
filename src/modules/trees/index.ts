// src/modules/trees/index.ts
import type { TreeModule } from '@/types/TreeModule'
import { TreeRenderer } from './TreeRenderer'
import { recordInsert } from './algorithms/insert'
import { recordSearch } from './algorithms/search'
import { recordInorder, recordPreorder, recordPostorder } from './algorithms/traverse'
import { insertSnippets } from './snippets/insert.snippets'
import { searchSnippets } from './snippets/search.snippets'
import { traverseSnippets } from './snippets/traverse.snippets'

export const treesModule: TreeModule = {
  id:            'trees',
  name:          'Trees',
  icon:          '🌲',
  route:         '/trees',
  Renderer:      TreeRenderer,
  defaultAlgoId: 'insert',
  algorithms: [
    {
      id: 'insert',
      name: 'BST Insertion',
      timeComplexity: { best: 'O(log N)', average: 'O(log N)', worst: 'O(N)' },
      spaceComplexity: 'O(H)',
      record: recordInsert,
      codeSnippets: insertSnippets
    },
    {
      id: 'search',
      name: 'BST Search',
      timeComplexity: { best: 'O(1)', average: 'O(log N)', worst: 'O(N)' },
      spaceComplexity: 'O(H)',
      record: recordSearch,
      codeSnippets: searchSnippets
    },
    {
      id: 'inorder',
      name: 'In-order Traversal',
      timeComplexity: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      spaceComplexity: 'O(H)',
      record: recordInorder,
      codeSnippets: traverseSnippets
    },
    {
      id: 'preorder',
      name: 'Pre-order Traversal',
      timeComplexity: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      spaceComplexity: 'O(H)',
      record: recordPreorder,
      codeSnippets: traverseSnippets
    },
    {
      id: 'postorder',
      name: 'Post-order Traversal',
      timeComplexity: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      spaceComplexity: 'O(H)',
      record: recordPostorder,
      codeSnippets: traverseSnippets
    }
  ]
}
