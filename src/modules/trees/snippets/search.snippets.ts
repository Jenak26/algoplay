// src/modules/trees/snippets/search.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const searchSnippets: CodeSnippets = {
  pseudocode: [
    "Search(root, val):",
    "  if root is null or root.val == val:",
    "    return root",
    "  if val < root.val:",
    "    return Search(root.left, val)",
    "  else:",
    "    return Search(root.right, val)",
    "  endif"
  ],
  python: [
    "def search(root, val):",
    "    if root is None or root.val == val:",
    "        return root",
    "    if val < root.val:",
    "        return search(root.left, val)",
    "    else:",
    "        return search(root.right, val)"
  ],
  javascript: [
    "function search(root, val) {",
    "  if (root === null || root.val === val) {",
    "    return root;",
    "  }",
    "  if (val < root.val) {",
    "    return search(root.left, val);",
    "  } else {",
    "    return search(root.right, val);",
    "  }",
    "}"
  ],
  lineMap: [0, 1, 2, 3, 4, 5, 6, 7]
}
