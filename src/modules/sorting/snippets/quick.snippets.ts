// src/modules/sorting/snippets/quick.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const quickSnippets: CodeSnippets = {
  pseudocode: [
    'procedure quickSort(arr, lo, hi)',
    '  if lo >= hi: return',
    '  // partition',
    '  pivot = arr[hi]',
    '  i = lo - 1',
    '  if arr[j] <= pivot: swap(++i,j)',
    '  swap(i+1, hi) -> pivot final pos',
    '  quickSort left and right',
    '  return arr',
  ],
  python: [
    'def quick_sort(arr,lo,hi):',
    '  if lo>=hi: return',
    '  # partition',
    '  pivot=arr[hi]; i=lo-1',
    '  for j in range(lo,hi):',
    '    if arr[j]<=pivot:',
    '      i+=1; swap(arr,i,j)',
    '  swap(arr,i+1,hi)',
    '  quick_sort(arr,lo,i); quick_sort(arr,i+2,hi)',
  ],
  javascript: [
    'function quickSort(arr,lo,hi) {',
    '  if(lo>=hi) return;',
    '  // partition',
    '  const pivot=arr[hi]; let i=lo-1;',
    '  for(let j=lo;j<hi;j++) {',
    '    if(arr[j]<=pivot)',
    '      swap(arr,++i,j); }',
    '  swap(arr,i+1,hi);',
    '}',
  ],
  lineMap: [],
}
