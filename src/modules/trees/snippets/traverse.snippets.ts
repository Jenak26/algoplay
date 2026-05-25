// src/modules/trees/snippets/traverse.snippets.ts
import type { CodeSnippets } from '@/types/AlgorithmModule'

export const traverseSnippets: CodeSnippets = {
  pseudocode: [
    "Traverse(root):",
    "  if root is null:",
    "    return",
    "  // Pre-order: output root.val here",
    "  Traverse(root.left)",
    "  // In-order: output root.val here",
    "  Traverse(root.right)",
    "  // Post-order: output root.val here",
    "  return"
  ],
  python: [
    "def traverse(root):",
    "    if root is None:",
    "        return",
    "    # Pre-order: print(root.val)",
    "    traverse(root.left)",
    "    # In-order: print(root.val)",
    "    traverse(root.right)",
    "    # Post-order: print(root.val)"
  ],
  javascript: [
    "function traverse(root) {",
    "  if (root === null) {",
    "    return;",
    "  }",
    "  // Pre-order: console.log(root.val);",
    "  traverse(root.left);",
    "  // In-order: console.log(root.val);",
    "  traverse(root.right);",
    "  // Post-order: console.log(root.val);",
    "}"
  ],
  lineMap: [0, 1, 2, 3, 4, 5, 6, 7, 8]
}
