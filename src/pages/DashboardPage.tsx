// src/pages/DashboardPage.tsx
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const categories = [
    {
      id: 'sorting',
      name: 'Sorting Algorithms',
      icon: '⚡',
      route: '/sorting',
      desc: 'Visualize data comparisons and array element swaps. Compare selection, bubble, insertion, merge, and quick sort.',
      complexities: { time: 'O(N log N) / O(N²)', space: 'O(1) / O(N)' },
      algos: 'Bubble, Selection, Insertion, Merge, Quick Sort',
      status: 'Active'
    },
    {
      id: 'pathfinding',
      name: 'Pathfinding Visualizer',
      icon: '🗺️',
      route: '/pathfinding',
      desc: 'Trace grid traversal paths. Find shortest routes while placing custom wall obstacles, start, and end nodes.',
      complexities: { time: 'O(V + E log V)', space: 'O(V)' },
      algos: 'Dijkstra, A* Search, BFS, DFS',
      status: 'Ready'
    },
    {
      id: 'graphs',
      name: 'Graph Traversal',
      icon: '🕸️',
      route: '/graphs',
      desc: 'Visualize vertex networks and connection edges. Add nodes, draw custom weighted links, and trace traverse executions.',
      complexities: { time: 'O(V + E)', space: 'O(V)' },
      algos: 'BFS, DFS, Prim\'s MST, Dijkstra',
      status: 'Ready'
    },
    {
      id: 'trees',
      name: 'Binary Search Trees',
      icon: '🌲',
      route: '/trees',
      desc: 'Manipulate interactive tree hierarchies. Insert nodes, search values, and traverse BSTs with full panning & zooming controls.',
      complexities: { time: 'O(log N) / O(N)', space: 'O(N)' },
      algos: 'Insertion, Search, Inorder, Preorder, Postorder',
      status: 'Ready'
    },
    {
      id: 'dp',
      name: 'Dynamic Programming',
      icon: '🧩',
      route: '/dp',
      desc: 'Deconstruct optimal subproblems. Inspect memorization matrices, lookback dependency lines, and optimal path backtracking.',
      complexities: { time: 'O(N * W) / O(N * M)', space: 'O(N * W)' },
      algos: 'Fibonacci, Knapsack 0/1, Levenshtein Edit Distance, Coin Change',
      status: 'Active'
    }
  ]

  const shortcuts = [
    { key: 'Spacebar', desc: 'Play or pause step execution' },
    { key: 'Right Arrow', desc: 'Step forward one instruction' },
    { key: 'Left Arrow', desc: 'Step backward one instruction' },
    { key: 'Escape', desc: 'Reset debugger back to start state' }
  ]

  return (
    <div className="h-full overflow-y-auto p-8 font-sans bg-bg text-text selection:bg-primary-dim selection:text-primary">
      {/* Hero Banner Section */}
      <section className="border border-border p-6 mb-8 bg-bg-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#00e383]/10 text-[#00e383] border border-[#00e383]/20 uppercase tracking-wider">
                System Active
              </span>
              <span className="text-text-muted text-[11px] font-mono">v2.4.0 • Obsidian Theme Loaded</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mb-2">
              DETERMINISTIC ALGORITHM EXECUTION DEBUGGER
            </h1>
            <p className="text-text-muted text-xs max-w-xl leading-relaxed">
              Welcome to the premium algorithm debugger and visualizer. This interactive workspace 
              lets you execute, pause, speed-profile, and inspect classic Data Structures & Algorithms step-by-step.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-w-[200px] bg-bg border border-border p-4 font-mono text-[10px] leading-5 text-text-muted">
            <div className="text-white font-bold border-b border-border pb-1 mb-1 uppercase tracking-wider text-[9px]">
              Keyboard Shortcuts
            </div>
            {shortcuts.map((s, idx) => (
              <div key={idx} className="flex justify-between gap-4">
                <kbd className="bg-bg-surface border border-border px-1.5 py-0.5 text-primary select-none font-bold">
                  {s.key}
                </kbd>
                <span>{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Center columns: Instructions & Categories */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* How to Use Section */}
          <section className="border border-border p-5 bg-bg-panel">
            <h2 className="text-xs font-mono font-black text-white uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
              <span className="text-primary font-mono">&gt;</span> USER GUIDE: HOW TO PREVIEW & DEBUG
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-border/40 p-3 bg-bg-surface">
                <div className="text-primary font-mono font-bold mb-1">01. CHOOSE MODULE</div>
                <p className="text-text-muted leading-relaxed">
                  Select a module from the left sidebar navigation deck (e.g., Sorting, DP, Graphs).
                </p>
              </div>
              <div className="border border-border/40 p-3 bg-bg-surface">
                <div className="text-primary font-mono font-bold mb-1">02. CONFIGURE VALUES</div>
                <p className="text-text-muted leading-relaxed">
                  Customize the data variables using the inputs on the top action bar (e.g. coin array, BST elements, grid speed).
                </p>
              </div>
              <div className="border border-border/40 p-3 bg-bg-surface">
                <div className="text-primary font-mono font-bold mb-1">03. STEP & RUN</div>
                <p className="text-text-muted leading-relaxed">
                  Click <strong className="text-white font-mono">PLAY</strong> or use arrow keys to step forward/backward. Adjust speed in real-time.
                </p>
              </div>
              <div className="border border-border/40 p-3 bg-bg-surface">
                <div className="text-primary font-mono font-bold mb-1">04. INSPECT CODE & STATE</div>
                <p className="text-text-muted leading-relaxed">
                  Monitor highlighted code lines in the editor tab (Python/JS/Pseudo) and inspect variables dynamically.
                </p>
              </div>
            </div>
          </section>

          {/* Module Categories Grid */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-mono font-black text-white uppercase tracking-wider border-b border-border pb-2">
              AVAILABLE DEBUGGER WORKSPACES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={c.route}
                  className="border border-border p-4 bg-bg-panel hover:border-primary transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c.icon}</span>
                        <span className="font-bold text-sm text-white group-hover:text-primary transition-colors">
                          {c.name}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-primary-dim text-primary border border-primary/20">
                        {c.status}
                      </span>
                    </div>
                    <p className="text-text-muted text-xs leading-relaxed mb-4">
                      {c.desc}
                    </p>
                  </div>
                  <div className="border-t border-border/50 pt-2 mt-auto flex justify-between font-mono text-[10px] text-text-muted">
                    <span>Time: <strong className="text-white">{c.complexities.time}</strong></span>
                    <span>Space: <strong className="text-white">{c.complexities.space}</strong></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right column: Big-O Cheat Sheet / Leaderboard & details */}
        <div className="flex flex-col gap-8">
          {/* Big-O Leaderboard */}
          <section className="border border-border p-5 bg-bg-panel h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-mono font-black text-white uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                ⏱️ COMPLEXITY CHEAT SHEET
              </h2>
              <p className="text-text-muted text-xs leading-relaxed mb-4">
                Reference guidelines for core algorithm complexities visualized inside this debugger.
              </p>
              
              <div className="flex flex-col gap-3 font-mono text-xs">
                <div className="border border-border/40 p-2.5 bg-bg-surface">
                  <div className="flex justify-between mb-1">
                    <span className="text-white font-bold">Merge / Quick Sort</span>
                    <span className="text-[#00e383] font-bold">O(N log N)</span>
                  </div>
                  <div className="w-full bg-bg h-1.5">
                    <div className="bg-[#00e383] h-full" style={{ width: '90%' }} />
                  </div>
                </div>

                <div className="border border-border/40 p-2.5 bg-bg-surface">
                  <div className="flex justify-between mb-1">
                    <span className="text-white font-bold">Dijkstra\'s Search</span>
                    <span className="text-[#00e383] font-bold">O(E log V)</span>
                  </div>
                  <div className="w-full bg-bg h-1.5">
                    <div className="bg-[#00e383] h-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="border border-border/40 p-2.5 bg-bg-surface">
                  <div className="flex justify-between mb-1">
                    <span className="text-white font-bold">BST Search / Insert</span>
                    <span className="text-primary font-bold">O(log N) avg</span>
                  </div>
                  <div className="w-full bg-bg h-1.5">
                    <div className="bg-primary h-full" style={{ width: '70%' }} />
                  </div>
                </div>

                <div className="border border-border/40 p-2.5 bg-bg-surface">
                  <div className="flex justify-between mb-1">
                    <span className="text-white font-bold">Knapsack / Levenshtein</span>
                    <span className="text-amber-400 font-bold">O(N * W)</span>
                  </div>
                  <div className="w-full bg-bg h-1.5">
                    <div className="bg-amber-400 h-full" style={{ width: '50%' }} />
                  </div>
                </div>

                <div className="border border-border/40 p-2.5 bg-bg-surface">
                  <div className="flex justify-between mb-1">
                    <span className="text-white font-bold">Bubble / Selection Sort</span>
                    <span className="text-[#ffb4ab] font-bold">O(N²)</span>
                  </div>
                  <div className="w-full bg-bg h-1.5">
                    <div className="bg-[#ffb4ab] h-full" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-6 text-[10px] font-mono text-text-muted">
              * O(N log N) is preferred for sorting large arrays. O(log N) operations on trees scale efficiently for nested lookups.
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}
