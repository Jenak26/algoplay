// src/modules/sorting/snippets/insertion.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const insertionSnippets: CodeSnippets = {
  pseudocode: [
    'procedure insertionSort(arr)',
    '  for i = 1 to n-1',
    '    key = arr[i]',
    '    j = i - 1',
    '    while j >= 0 and arr[j] > key',
    '      arr[j+1] = arr[j]',
    '      j = j - 1',
    '    arr[j+1] = key',
    '  return arr',
  ],
  python: [
    'def insertion_sort(arr):',
    '  for i in range(1, len(arr)):',
    '    key = arr[i]',
    '    j = i - 1',
    '    while j>=0 and arr[j]>key:',
    '      arr[j+1] = arr[j]',
    '      j -= 1',
    '    arr[j+1] = key',
    '  return arr',
  ],
  javascript: [
    'function insertionSort(arr) {',
    '  for (let i=1; i<n; i++) {',
    '    let key=arr[i], j=i-1;',
    '    // j=i-1',
    '    while(j>=0 && arr[j]>key) {',
    '      arr[j+1]=arr[j];',
    '      j--; }',
    '    arr[j+1]=key;',
    '  } return arr; }',
  ],
  lineMap: [],
}
