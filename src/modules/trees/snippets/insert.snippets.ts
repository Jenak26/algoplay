// src/modules/trees/snippets/insert.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const insertSnippets: CodeSnippets = {
  pseudocode: [
    "Insert(root, val):",
    "  if root is null:",
    "    return new Node(val)",
    "  if val < root.val:",
    "    root.left = Insert(root.left, val)",
    "  else:",
    "    root.right = Insert(root.right, val)",
    "  endif",
    "  return root"
  ],
  python: [
    "def insert(root, val):",
    "    if root is None:",
    "        return Node(val)",
    "    if val < root.val:",
    "        root.left = insert(root.left, val)",
    "    else:",
    "        root.right = insert(root.right, val)",
    "    return root"
  ],
  javascript: [
    "function insert(root, val) {",
    "  if (root === null) {",
    "    return new Node(val);",
    "  }",
    "  if (val < root.val) {",
    "    root.left = insert(root.left, val);",
    "  } else {",
    "    root.right = insert(root.right, val);",
    "  }",
    "  return root;",
    "}"
  ],
  lineMap: [0, 1, 2, 3, 4, 5, 6, 7, 8]
}
