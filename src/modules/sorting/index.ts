// src/modules/sorting/index.ts
import type { AlgorithmModule } from '@/types/AlgorithmModule'
import { SortRenderer } from './SortRenderer'
import { recordBubble }    from './algorithms/bubble'
import { recordSelection } from './algorithms/selection'
import { recordInsertion } from './algorithms/insertion'
import { recordCocktail }  from './algorithms/cocktail'
import { recordMerge }     from './algorithms/merge'
import { recordQuick }     from './algorithms/quick'
import { recordHeap }      from './algorithms/heap'
import { recordShell }     from './algorithms/shell'
import { recordCounting }  from './algorithms/counting'
import { recordRadix }     from './algorithms/radix'
import { bubbleSnippets }    from './snippets/bubble.snippets'
import { selectionSnippets } from './snippets/selection.snippets'
import { insertionSnippets } from './snippets/insertion.snippets'
import { cocktailSnippets }  from './snippets/cocktail.snippets'
import { mergeSnippets }     from './snippets/merge.snippets'
import { quickSnippets }     from './snippets/quick.snippets'
import { heapSnippets }      from './snippets/heap.snippets'
import { shellSnippets }     from './snippets/shell.snippets'
import { countingSnippets }  from './snippets/counting.snippets'
import { radixSnippets }     from './snippets/radix.snippets'

export const sortingModule: AlgorithmModule = {
  id:            'sorting',
  name:          'Sorting',
  icon:          '⚡',
  route:         '/sorting',
  defaultAlgoId: 'bubble',
  Renderer:      SortRenderer,
  algorithms: [
    {
      id: 'bubble', name: 'Bubble Sort',
      timeComplexity: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)' },
      spaceComplexity: 'O(1)', stable: true,
      record: recordBubble, codeSnippets: bubbleSnippets,
    },
    {
      id: 'selection', name: 'Selection Sort',
      timeComplexity: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)' },
      spaceComplexity: 'O(1)', stable: false,
      record: recordSelection, codeSnippets: selectionSnippets,
    },
    {
      id: 'insertion', name: 'Insertion Sort',
      timeComplexity: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)' },
      spaceComplexity: 'O(1)', stable: true,
      record: recordInsertion, codeSnippets: insertionSnippets,
    },
    {
      id: 'cocktail', name: 'Cocktail Shaker',
      timeComplexity: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)' },
      spaceComplexity: 'O(1)', stable: true,
      record: recordCocktail, codeSnippets: cocktailSnippets,
    },
    {
      id: 'merge', name: 'Merge Sort',
      timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      spaceComplexity: 'O(n)', stable: true,
      record: recordMerge, codeSnippets: mergeSnippets,
    },
    {
      id: 'quick', name: 'Quick Sort',
      timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)' },
      spaceComplexity: 'O(log n)', stable: false,
      record: recordQuick, codeSnippets: quickSnippets,
    },
    {
      id: 'heap', name: 'Heap Sort',
      timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      spaceComplexity: 'O(1)', stable: false,
      record: recordHeap, codeSnippets: heapSnippets,
    },
    {
      id: 'shell', name: 'Shell Sort',
      timeComplexity: { best: 'O(n log n)', average: 'O(n log^2 n)', worst: 'O(n^2)' },
      spaceComplexity: 'O(1)', stable: false,
      record: recordShell, codeSnippets: shellSnippets,
    },
    {
      id: 'counting', name: 'Counting Sort',
      timeComplexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)' },
      spaceComplexity: 'O(k)', stable: true,
      record: recordCounting, codeSnippets: countingSnippets,
    },
    {
      id: 'radix', name: 'Radix Sort',
      timeComplexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
      spaceComplexity: 'O(n+k)', stable: true,
      record: recordRadix, codeSnippets: radixSnippets,
    },
  ],
}
