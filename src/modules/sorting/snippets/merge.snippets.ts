// src/modules/sorting/snippets/merge.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const mergeSnippets: CodeSnippets = {
  pseudocode: [
    'procedure mergeSort(arr, l, r)',
    '  if l >= r: return',
    '  m = (l+r) / 2',
    '  merge halves l..m and m+1..r',
    '  i=0; j=0; k=l',
    '  while both halves have elements',
    '    arr[k] = smaller element',
    '  return merged',
  ],
  python: [
    'def merge_sort(arr):',
    '  if len(arr)<=1: return arr',
    '  mid=len(arr)//2',
    '  L=merge_sort(arr[:mid])',
    '  R=merge_sort(arr[mid:])',
    '  i=j=k=0',
    '  # merge L and R back into arr',
    '  return arr',
  ],
  javascript: [
    'function mergeSort(arr,l,r) {',
    '  if(l>=r) return;',
    '  const m=(l+r)>>1;',
    '  mergeSort(arr,l,m);',
    '  mergeSort(arr,m+1,r);',
    '  // merge',
    '  arr[k]=left[i]<=right[j]?left[i++]:right[j++];',
    '}',
  ],
  lineMap: [],
}
