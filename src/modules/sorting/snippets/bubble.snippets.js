export const bubbleSnippets = {
    pseudocode: [
        'procedure bubbleSort(arr)',
        '  for i = 0 to n-2',
        '    for j = 0 to n-i-2',
        '      if arr[j] > arr[j+1]',
        '        swap(arr[j], arr[j+1])',
        '  return arr',
    ],
    python: [
        'def bubble_sort(arr):',
        '  for i in range(len(arr)-1):',
        '    for j in range(len(arr)-i-1):',
        '      if arr[j] > arr[j+1]:',
        '        arr[j],arr[j+1]=arr[j+1],arr[j]',
        '  return arr',
    ],
    javascript: [
        'function bubbleSort(arr) {',
        '  for (let i=0; i<n-1; i++) {',
        '    for (let j=0; j<n-i-1; j++) {',
        '      if (arr[j] > arr[j+1]) {',
        '        [arr[j],arr[j+1]]=[arr[j+1],arr[j]]',
        '  } } return arr; }',
    ],
    lineMap: [],
};
