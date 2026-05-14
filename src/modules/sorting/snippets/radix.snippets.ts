// src/modules/sorting/snippets/radix.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const radixSnippets: CodeSnippets = {
  pseudocode: [
    'procedure radixSort(arr)',
    '  for exp = 1, 10, 100 ...',
    '    count digits at position exp',
    '    digit = (arr[i] / exp) % 10',
    '    build cumulative count',
    '    build output array',
    '    copy output back to arr',
    '    place arr[i] at position exp',
    '  return arr',
  ],
  python: [
    'def radix_sort(arr):',
    '  exp=1',
    '  while max(arr)//exp>0:',
    '    digit=(x//exp)%10',
    '    # count digits',
    '    # cumulative',
    '    # build output',
    '    arr[:]=output; exp*=10',
    '  return arr',
  ],
  javascript: [
    'function radixSort(arr) {',
    '  for(let exp=1;max/exp>0;exp*=10)',
    '  {',
    '    const digit=Math.floor(arr[i]/exp)%10;',
    '    count[digit]++;',
    '    // cumulative',
    '    // build output',
    '    arr[i]=output[i];',
    '  } return arr; }',
  ],
  lineMap: [],
}
