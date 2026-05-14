// src/modules/sorting/snippets/heap.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const heapSnippets: CodeSnippets = {
  pseudocode: [
    'procedure heapSort(arr)',
    '  // build max-heap',
    '  heapify(arr, n, i)',
    '    compare parent with children',
    '    swap parent with largest child',
    '  swap(arr[0], arr[i])',
    '  return arr',
  ],
  python: [
    'def heap_sort(arr):',
    '  n=len(arr)',
    '  for i in range(n//2-1,-1,-1):',
    '    heapify(arr,n,i)',
    '    if largest!=i: swap & recurse',
    '  for i in range(n-1,0,-1):',
    '    arr[0],arr[i]=arr[i],arr[0]',
    '  return arr',
  ],
  javascript: [
    'function heapSort(arr) {',
    '  const n=arr.length;',
    '  for(let i=n/2-1;i>=0;i--)',
    '    heapify(arr,n,i);',
    '  // heapify swap',
    '  for(let i=n-1;i>0;i--) {',
    '    [arr[0],arr[i]]=[arr[i],arr[0]];',
    '}',
  ],
  lineMap: [],
}
