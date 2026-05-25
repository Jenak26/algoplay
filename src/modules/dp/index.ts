// src/modules/dp/index.ts
import type { DPModule } from '@/types/DPModule'
import { DPRenderer } from './DPRenderer'
import { recordKnapsack } from './algorithms/knapsack'
import { recordLCS } from './algorithms/lcs'
import { recordEditDistance } from './algorithms/editDistance'
import { recordCoinChange } from './algorithms/coinChange'
import { knapsackSnippets } from './snippets/knapsack.snippets'
import { lcsSnippets } from './snippets/lcs.snippets'
import { editDistanceSnippets } from './snippets/editDistance.snippets'
import { coinChangeSnippets } from './snippets/coinChange.snippets'

export const dpModule: DPModule = {
  id:            'dp',
  name:          'Dynamic Programming',
  icon:          '🧩',
  route:         '/dp',
  Renderer:      DPRenderer,
  defaultAlgoId: 'knapsack',
  algorithms: [
    {
      id: 'knapsack',
      name: '0/1 Knapsack',
      timeComplexity: { best: 'O(N*W)', average: 'O(N*W)', worst: 'O(N*W)' },
      spaceComplexity: 'O(N*W)',
      record: recordKnapsack,
      codeSnippets: knapsackSnippets
    },
    {
      id: 'lcs',
      name: 'Longest Common Subsequence',
      timeComplexity: { best: 'O(N*M)', average: 'O(N*M)', worst: 'O(N*M)' },
      spaceComplexity: 'O(N*M)',
      record: recordLCS,
      codeSnippets: lcsSnippets
    },
    {
      id: 'edit_distance',
      name: 'Edit Distance',
      timeComplexity: { best: 'O(N*M)', average: 'O(N*M)', worst: 'O(N*M)' },
      spaceComplexity: 'O(N*M)',
      record: recordEditDistance,
      codeSnippets: editDistanceSnippets
    },
    {
      id: 'coin_change',
      name: 'Coin Change (Min Coins)',
      timeComplexity: { best: 'O(N*A)', average: 'O(N*A)', worst: 'O(N*A)' },
      spaceComplexity: 'O(N*A)',
      record: recordCoinChange,
      codeSnippets: coinChangeSnippets
    }
  ]
}
