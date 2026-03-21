import sys

with open('src/components/visualizer-tools/challenges/CodeChallengesVisualizer.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Imports
if 'import { useQuery }' not in text:
    text = text.replace(import { markChallengeSolved } from '@/lib/user-progress';,
import { markChallengeSolved } from '@/lib/user-progress';\nimport { useQuery } from 'convex/react';\nimport { api } from '../../../../convex/_generated/api';)

text = text.replace(import { Play, RotateCcw, CheckCircle2, XCircle, Trophy, ChevronRight, Code2 } from 'lucide-react';,
import { Play, RotateCcw, CheckCircle2, XCircle, Trophy, ChevronRight, Code2, Search, User } from 'lucide-react';)

# 2. Logic Injection
old_func_start = """export function CodeChallengesVisualizer() {
  const [searchQuery, setSearchQuery] = useState('');
  const userChallengesRaw = useQuery(api.userChallenges.list) || [];
  const [selectedId, setSelectedId] = useState(CHALLENGES[0].id);
  const [code, setCode] = useState(CHALLENGES[0].starterCode);"""

new_func_start = """export function CodeChallengesVisualizer() {
  const [searchQuery, setSearchQuery] = useState('');
  const userChallengesRaw = useQuery(api.userChallenges.list) || [];
  
  const userChallenges = userChallengesRaw.map(c => ({
    id: c._id,
    title: c.title,
    difficulty: c.difficulty as Difficulty,
    category: c.category,
    description: c.description,
    examples: [],
    testCases: c.testCases,
    starterCode: c.starterCode,
    hints: [],
    solution: '',
    isUserAdded: true,
    authorName: c.authorName
  }));

  const ALL_CHALLENGES = [...CHALLENGES, ...userChallenges] as Challenge[];

  const [selectedId, setSelectedId] = useState(CHALLENGES[0].id);
  const [code, setCode] = useState(CHALLENGES[0].starterCode);"""
text = text.replace(old_func_start, new_func_start)

old_fallback = """export function CodeChallengesVisualizer() {
  const [selectedId, setSelectedId] = useState(CHALLENGES[0].id);
  const [code, setCode] = useState(CHALLENGES[0].starterCode);"""
text = text.replace(old_fallback, new_func_start)

# 3. Replacements for CHALLENGES usage
text = text.replace("const challenge = CHALLENGES.find(c => c.id === selectedId)!;", "const challenge = ALL_CHALLENGES.find(c => c.id === selectedId) || ALL_CHALLENGES[0];")

text = text.replace("const filtered = filter === 'all' ? CHALLENGES : CHALLENGES.filter(c => c.difficulty === filter);", 
"""const filtered = ALL_CHALLENGES.filter(c => {
    const matchesFilter = filter === 'all' || c.difficulty === filter;
    const matchesSearch = c.title.lower().includes(searchQuery.lower()) || c.category.lower().includes(searchQuery.lower());
    return matchesFilter && matchesSearch;
  });""".replace(".lower()", ".toLowerCase()"))
  
text = text.replace("""const selectChallenge = (id: string) => {
    const c = CHALLENGES.find(ch => ch.id === id)!;""",
"""const selectChallenge = (id: string) => {
    const c = ALL_CHALLENGES.find(ch => ch.id === id)!;""")

# 4. Search UI
old_header = """<h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Difficulty</h3>"""
new_header = """
        <div className="mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search challenges..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent text-foreground"
            />
          </div>
        </div>
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Filter by Difficulty</h3>
"""
text = text.replace(old_header, new_header)

# 5. User Label in Headers
old_challenge_title = """<div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', difficultyColor(challenge.difficulty))}>
                  {challenge.category}
                </span>
                <span className={cn('text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full border', difficultyColor(challenge.difficulty))}>
                  {challenge.difficulty}
                </span>"""
new_challenge_title = """<div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', difficultyColor(challenge.difficulty))}>
                  {challenge.category}
                </span>
                <span className={cn('text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full border', difficultyColor(challenge.difficulty))}>
                  {challenge.difficulty}
                </span>
                {(challenge as any).isUserAdded && (
                  <span className="text-[10px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                    <User className="w-3 h-3" /> Community by {(challenge as any).authorName}
                  </span>
                )}"""
text = text.replace(old_challenge_title, new_challenge_title)

old_sidebar = """<div className="font-semibold text-foreground truncate">{c.title}</div>
                  <div className="text-[10px] text-muted truncate">{c.category}</div>"""
new_sidebar = """<div className="font-semibold text-foreground truncate flex items-center gap-2">
                    {c.title}
                    {(c as any).isUserAdded && <User className="w-3 h-3 text-accent shrink-0" title="Community Challenge" />}
                  </div>
                  <div className="text-[10px] text-muted truncate">{c.category}</div>"""
text = text.replace(old_sidebar, new_sidebar)

with open('src/components/visualizer-tools/challenges/CodeChallengesVisualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

