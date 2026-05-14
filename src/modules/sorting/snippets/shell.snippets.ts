// src/modules/sorting/snippets/shell.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const shellSnippets: CodeSnippets = {
  pseudocode: [
    'procedure shellSort(arr)',
    '  gap = n/2',
    '  while gap > 0',
    '    key = arr[i]',
    '    while j>=gap and arr[j-gap]>key',
    '      arr[j] = arr[j-gap]',
    '    arr[j] = key',
    '  return arr',
  ],
  python: [
    'def shell_sort(arr):',
    '  gap=len(arr)//2',
    '  while gap>0:',
    '    for i in range(gap,len(arr)):',
    '      temp=arr[i]; j=i',
    '      while j>=gap and arr[j-gap]>temp:',
    '        arr[j]=arr[j-gap]; j-=gap',
    '      arr[j]=temp',
    '    gap//=2',
  ],
  javascript: [
    'function shellSort(arr) {',
    '  for(let gap=n>>1;gap>0;gap>>=1)',
    '    for(let i=gap;i<n;i++) {',
    '      let temp=arr[i],j=i;',
    '      while(j>=gap&&arr[j-gap]>temp)',
    '        arr[j]=arr[j-gap],j-=gap;',
    '      arr[j]=temp;',
    '}',
  ],
  lineMap: [],
}
