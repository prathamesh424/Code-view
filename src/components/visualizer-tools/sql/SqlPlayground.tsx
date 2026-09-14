'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, RotateCcw, Database, Table2, ChevronDown, ChevronRight,
  Clock, Trash2, Copy, Check, AlertCircle, Loader2, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Database as SqlDatabase, QueryExecResult } from 'sql.js';

/* ── Types ── */
interface QueryResult {
  columns: string[];
  values: (string | number | null)[][];
}

interface HistoryEntry {
  query: string;
  timestamp: number;
  success: boolean;
  rowCount: number;
}

interface TableInfo {
  name: string;
  columns: { name: string; type: string; notnull: boolean; pk: boolean }[];
  expanded: boolean;
}

/* ── Sample queries ── */
const SAMPLE_QUERIES: { label: string; category: string; query: string }[] = [
  {
    label: 'Select All Employees',
    category: 'Basic',
    query: 'SELECT * FROM employees;',
  },
  {
    label: 'Employees with Salary > 70000',
    category: 'WHERE',
    query: "SELECT name, department, salary\nFROM employees\nWHERE salary > 70000\nORDER BY salary DESC;",
  },
  {
    label: 'Department Average Salary',
    category: 'GROUP BY',
    query: "SELECT department, \n  COUNT(*) AS headcount,\n  ROUND(AVG(salary), 2) AS avg_salary,\n  MAX(salary) AS max_salary\nFROM employees\nGROUP BY department\nORDER BY avg_salary DESC;",
  },
  {
    label: 'Employees with Orders (JOIN)',
    category: 'JOIN',
    query: "SELECT e.name, e.department, o.product, o.amount\nFROM employees e\nINNER JOIN orders o ON e.id = o.employee_id\nORDER BY o.amount DESC;",
  },
  {
    label: 'Left Join — All Employees',
    category: 'JOIN',
    query: "SELECT e.name, e.department, \n  COALESCE(o.product, 'No Orders') AS product,\n  COALESCE(o.amount, 0) AS amount\nFROM employees e\nLEFT JOIN orders o ON e.id = o.employee_id\nORDER BY e.name;",
  },
  {
    label: 'Subquery — Above Avg Salary',
    category: 'Subquery',
    query: "SELECT name, department, salary\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees)\nORDER BY salary DESC;",
  },
  {
    label: 'Department Stats with HAVING',
    category: 'HAVING',
    query: "SELECT department, COUNT(*) AS count, SUM(salary) AS total_salary\nFROM employees\nGROUP BY department\nHAVING COUNT(*) >= 2\nORDER BY total_salary DESC;",
  },
  {
    label: 'Window Function — Rank by Salary',
    category: 'Window',
    query: "SELECT name, department, salary,\n  RANK() OVER (ORDER BY salary DESC) AS overall_rank,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank\nFROM employees;",
  },
  {
    label: 'Running Total with Window',
    category: 'Window',
    query: "SELECT name, salary,\n  SUM(salary) OVER (ORDER BY salary) AS running_total\nFROM employees\nORDER BY salary;",
  },
  {
    label: 'CASE Expression',
    category: 'CASE',
    query: "SELECT name, salary,\n  CASE\n    WHEN salary >= 90000 THEN 'Senior'\n    WHEN salary >= 70000 THEN 'Mid'\n    ELSE 'Junior'\n  END AS level\nFROM employees\nORDER BY salary DESC;",
  },
  {
    label: 'Create & Insert',
    category: 'DDL',
    query: "CREATE TABLE IF NOT EXISTS projects (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  budget REAL\n);\n\nINSERT INTO projects VALUES (1, 'Apollo', 50000);\nINSERT INTO projects VALUES (2, 'Gemini', 75000);\n\nSELECT * FROM projects;",
  },
];

/* ── Schema init SQL ── */
const INIT_SQL = `
CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  budget REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  salary REAL NOT NULL,
  hire_date TEXT NOT NULL,
  email TEXT,
  department_id INTEGER REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  product TEXT NOT NULL,
  amount REAL NOT NULL,
  order_date TEXT NOT NULL
);

INSERT INTO departments VALUES (1, 'Engineering', 'Building A', 500000);
INSERT INTO departments VALUES (2, 'Marketing', 'Building B', 200000);
INSERT INTO departments VALUES (3, 'Sales', 'Building C', 300000);
INSERT INTO departments VALUES (4, 'HR', 'Building A', 150000);
INSERT INTO departments VALUES (5, 'Finance', 'Building D', 250000);

INSERT INTO employees VALUES (1, 'Alice Johnson', 'Engineering', 95000, '2021-03-15', 'alice@company.com', 1);
INSERT INTO employees VALUES (2, 'Bob Smith', 'Marketing', 72000, '2020-07-01', 'bob@company.com', 2);
INSERT INTO employees VALUES (3, 'Carol Williams', 'Engineering', 105000, '2019-11-20', 'carol@company.com', 1);
INSERT INTO employees VALUES (4, 'Dave Brown', 'Sales', 68000, '2022-01-10', 'dave@company.com', 3);
INSERT INTO employees VALUES (5, 'Eve Davis', 'Engineering', 88000, '2021-09-05', 'eve@company.com', 1);
INSERT INTO employees VALUES (6, 'Frank Miller', 'HR', 62000, '2023-02-14', 'frank@company.com', 4);
INSERT INTO employees VALUES (7, 'Grace Lee', 'Marketing', 78000, '2020-05-22', 'grace@company.com', 2);
INSERT INTO employees VALUES (8, 'Hank Wilson', 'Sales', 71000, '2021-08-30', 'hank@company.com', 3);
INSERT INTO employees VALUES (9, 'Ivy Chen', 'Finance', 92000, '2019-04-18', 'ivy@company.com', 5);
INSERT INTO employees VALUES (10, 'Jack Taylor', 'Engineering', 110000, '2018-12-01', 'jack@company.com', 1);
INSERT INTO employees VALUES (11, 'Karen White', 'Finance', 85000, '2020-10-15', 'karen@company.com', 5);
INSERT INTO employees VALUES (12, 'Leo Martinez', 'Sales', 74000, '2022-06-20', 'leo@company.com', 3);

INSERT INTO orders VALUES (1, 1, 'Laptop Pro', 2499.99, '2024-01-15');
INSERT INTO orders VALUES (2, 1, 'Monitor 4K', 799.99, '2024-02-20');
INSERT INTO orders VALUES (3, 3, 'Server Rack', 5999.00, '2024-01-22');
INSERT INTO orders VALUES (4, 5, 'Keyboard', 249.99, '2024-03-01');
INSERT INTO orders VALUES (5, 2, 'Marketing Suite', 1200.00, '2024-02-10');
INSERT INTO orders VALUES (6, 4, 'CRM License', 899.00, '2024-01-30');
INSERT INTO orders VALUES (7, 7, 'Design Tool', 599.00, '2024-03-05');
INSERT INTO orders VALUES (8, 9, 'Accounting SW', 1500.00, '2024-02-28');
INSERT INTO orders VALUES (9, 10, 'Cloud Credits', 3000.00, '2024-01-05');
INSERT INTO orders VALUES (10, 3, 'IDE License', 399.00, '2024-03-10');
`;


export function SqlPlayground() {
  const [db, setDb] = useState<SqlDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('SELECT * FROM employees;');
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSchema, setShowSchema] = useState(true);
  const [showSamples, setShowSamples] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ── Initialize sql.js ── */
  useEffect(() => {
    let cancelled = false;
    let database: SqlDatabase | null = null;
    async function init() {
      try {
        const initSqlJs = (await import('sql.js')).default;
        const SQL = await initSqlJs({
          locateFile: () => '/sql-wasm.wasm',
        });
        if (cancelled) return;
        database = new SQL.Database();
        database.run(INIT_SQL);
        setDb(database);
        setLoading(false);
        // Load schema
        refreshSchema(database);
      } catch {
        if (!cancelled) {
          setError('Failed to load SQL engine. Please refresh the page.');
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
      database?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshSchema = useCallback((database: SqlDatabase) => {
    try {
      const res: QueryExecResult[] = database.exec(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
      );
      if (res.length > 0) {
        const tableInfos: TableInfo[] = res[0].values.map((row: (string | number | null)[]) => {
          const tName = row[0] as string;
          const colRes: QueryExecResult[] = database.exec(`PRAGMA table_info('${tName}');`);
          const columns = colRes.length > 0
            ? colRes[0].values.map((c: (string | number | null)[]) => ({
                name: c[1] as string,
                type: c[2] as string,
                notnull: c[3] === 1,
                pk: c[5] === 1,
              }))
            : [];
          return { name: tName, columns, expanded: false };
        });
        setTables(tableInfos);
      }
    } catch { /* ignore */ }
  }, []);

  /* ── Execute query ── */
  const executeQuery = useCallback(() => {
    if (!db || !query.trim()) return;
    setError(null);
    setResults([]);
    const start = performance.now();

    try {
      const res: QueryExecResult[] = db.exec(query);
      const elapsed = performance.now() - start;
      setExecTime(elapsed);
      setResults(res.map((r: QueryExecResult) => ({ columns: r.columns, values: r.values })));
      const totalRows = res.reduce((acc: number, r: QueryExecResult) => acc + r.values.length, 0);
      setHistory(prev => [
        { query, timestamp: Date.now(), success: true, rowCount: totalRows },
        ...prev.slice(0, 49),
      ]);
      // Refresh schema in case DDL was run
      refreshSchema(db);
    } catch (err: unknown) {
      const elapsed = performance.now() - start;
      setExecTime(elapsed);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHistory(prev => [
        { query, timestamp: Date.now(), success: false, rowCount: 0 },
        ...prev.slice(0, 49),
      ]);
    }
  }, [db, query, refreshSchema]);

  const resetDatabase = useCallback(() => {
    if (!db) return;
    try {
      // Drop all user tables
      const res: QueryExecResult[] = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
      if (res.length > 0) {
        res[0].values.forEach((row: (string | number | null)[]) => {
          db.run(`DROP TABLE IF EXISTS "${row[0]}";`);
        });
      }
      db.run(INIT_SQL);
      refreshSchema(db);
      setResults([]);
      setError(null);
      setExecTime(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [db, refreshSchema]);

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [query]);

  const toggleTable = (name: string) => {
    setTables(prev => prev.map(t =>
      t.name === name ? { ...t, expanded: !t.expanded } : t
    ));
  };

  /* ── Keyboard shortcut ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeQuery();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [executeQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-muted text-sm">Loading SQL engine (WASM)…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={executeQuery}
          disabled={!db || !query.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          Run Query
          <kbd className="ml-1 text-[10px] opacity-60 hidden sm:inline">Ctrl+Enter</kbd>
        </button>

        <button
          onClick={resetDatabase}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset DB
        </button>

        <button
          onClick={copyToClipboard}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>

        <div className="relative ml-auto" >
          <button
            onClick={() => setShowSamples(!showSamples)}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-accent/10 text-accent hover:bg-accent/20 border border-accent/30 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Sample Queries
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showSamples && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {showSamples && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-full mt-2 w-80 max-h-80 overflow-y-auto bg-surface border border-border rounded-xl shadow-2xl z-50"
              >
                {SAMPLE_QUERIES.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(sq.query); setShowSamples(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-surface-secondary transition-colors border-b border-border/50 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 text-accent">{sq.category}</span>
                      <span className="text-sm font-medium text-foreground">{sq.label}</span>
                    </div>
                    <p className="text-[11px] text-muted mt-1 font-mono line-clamp-1">{sq.query.split('\n')[0]}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main area: Schema + Editor + Results */}
      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Schema sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <button
            onClick={() => setShowSchema(!showSchema)}
            className="flex items-center gap-2 text-sm font-bold text-foreground mb-2 lg:cursor-default"
          >
            <Database className="w-4 h-4 text-accent" />
            Schema Explorer
            <ChevronDown className={cn('w-3.5 h-3.5 lg:hidden transition-transform', showSchema && 'rotate-180')} />
          </button>

          <div className={cn('space-y-1', !showSchema && 'hidden lg:block')}>
            {tables.map((table) => (
              <div key={table.name} className="bg-surface rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => toggleTable(table.name)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-secondary transition-colors"
                >
                  {table.expanded
                    ? <ChevronDown className="w-3 h-3 text-muted" />
                    : <ChevronRight className="w-3 h-3 text-muted" />
                  }
                  <Table2 className="w-3.5 h-3.5 text-accent" />
                  {table.name}
                  <span className="text-[10px] text-muted ml-auto">{table.columns.length} cols</span>
                </button>

                <AnimatePresence>
                  {table.expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-2 space-y-0.5">
                        {table.columns.map((col) => (
                          <div
                            key={col.name}
                            className="flex items-center gap-2 text-[11px] py-0.5 cursor-pointer hover:text-accent transition-colors"
                            onClick={() => setQuery(prev => prev + col.name)}
                          >
                            <span className={cn('font-mono', col.pk ? 'text-warning font-bold' : 'text-foreground')}>
                              {col.pk ? '🔑 ' : ''}{col.name}
                            </span>
                            <span className="text-muted ml-auto text-[10px]">{col.type}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* History */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm font-bold text-foreground mt-4 mb-2"
          >
            <Clock className="w-4 h-4 text-accent" />
            History ({history.length})
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showHistory && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-1 max-h-48 overflow-y-auto"
              >
                {history.length === 0 ? (
                  <p className="text-xs text-muted italic px-2">No queries yet</p>
                ) : (
                  history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(h.query)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-surface border border-border hover:bg-surface-secondary transition-colors text-[11px]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={cn('w-1.5 h-1.5 rounded-full', h.success ? 'bg-green-400' : 'bg-red-400')} />
                        <span className="text-muted">{h.rowCount} rows</span>
                        <span className="text-muted/50 ml-auto">
                          {new Date(h.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="font-mono text-foreground truncate mt-0.5">{h.query}</p>
                    </button>
                  ))
                )}
                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="w-full text-center py-1.5 text-[10px] text-muted hover:text-error transition-colors"
                  >
                    <Trash2 className="w-3 h-3 inline mr-1" />Clear History
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Editor + Results */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* SQL Editor */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-secondary/50">
              <span className="text-xs font-mono text-muted">SQL Query</span>
              {execTime !== null && (
                <span className="text-[10px] text-muted">
                  ⚡ {execTime < 1 ? '<1' : execTime.toFixed(1)}ms
                </span>
              )}
            </div>
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck={false}
              className="w-full min-h-[140px] max-h-[300px] p-4 bg-transparent text-sm font-mono text-foreground resize-y focus:outline-none placeholder:text-muted/50"
              placeholder="Write your SQL query here..."
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 px-4 py-3 rounded-xl bg-error/10 border border-error/30 text-sm"
              >
                <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-error">Query Error</p>
                  <p className="text-error/80 text-xs mt-0.5 font-mono">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((result, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-surface rounded-xl border border-border overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-secondary/50">
                    <span className="text-xs font-bold text-foreground">
                      Results {results.length > 1 ? `(${idx + 1}/${results.length})` : ''}
                    </span>
                    <span className="text-[10px] text-muted">
                      {result.values.length} row{result.values.length !== 1 ? 's' : ''} × {result.columns.length} column{result.columns.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          {result.columns.map((col, ci) => (
                            <th
                              key={ci}
                              className="px-4 py-2.5 text-left text-xs font-bold text-accent uppercase tracking-wider bg-accent/5 whitespace-nowrap"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.values.map((row, ri) => (
                          <tr
                            key={ri}
                            className={cn(
                              'border-b border-border/50 transition-colors hover:bg-accent/5',
                              ri % 2 === 0 ? 'bg-transparent' : 'bg-surface-secondary/30'
                            )}
                          >
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-4 py-2 text-sm font-mono text-foreground whitespace-nowrap">
                                {cell === null ? (
                                  <span className="text-muted italic">NULL</span>
                                ) : (
                                  String(cell)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {results.length === 0 && !error && (
            <div className="text-center py-12 text-muted">
              <Database className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Run a query to see results</p>
              <p className="text-xs mt-1 opacity-60">Press Ctrl+Enter or click Run Query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
