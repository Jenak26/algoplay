// src/modules/registry.ts
// Module registry — each phase adds its real module here.
// For Phase 1, all entries are placeholders with no algorithms or renderer.

export interface ModuleNavEntry {
  id:    string
  name:  string
  icon:  string
  route: string
}

export const MODULE_NAV: ModuleNavEntry[] = [
  { id: 'dashboard',   name: 'Dashboard',     icon: '🏠', route: '/dashboard'   },
  { id: 'sorting',     name: 'Sorting',       icon: '⚡', route: '/sorting'     },
  { id: 'pathfinding', name: 'Pathfinding',   icon: '🗺', route: '/pathfinding' },
  { id: 'graphs',      name: 'Graphs',        icon: '🕸', route: '/graphs'      },
  { id: 'trees',       name: 'Trees',         icon: '🌲', route: '/trees'       },
  { id: 'dp',          name: 'Dynamic Prog.', icon: '🧩', route: '/dp'          },
]
