import problemsData from './data/problems.json'
import type { Problem } from './types'

const problems = problemsData as Problem[]

function groupByCategory(items: Problem[]): Map<string, Problem[]> {
  const groups = new Map<string, Problem[]>()
  for (const problem of items) {
    const group = groups.get(problem.category)
    if (group) {
      group.push(problem)
    } else {
      groups.set(problem.category, [problem])
    }
  }
  return groups
}

const difficultyColor: Record<Problem['difficulty'], string> = {
  Easy: 'text-green-600 dark:text-green-400',
  Medium: 'text-yellow-600 dark:text-yellow-400',
  Hard: 'text-red-600 dark:text-red-400',
}

function App() {
  const grouped = groupByCategory(problems)

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="mx-auto max-w-3xl px-4 pt-8 pb-4">
        <h1 className="text-2xl font-semibold">NeetCode with Frenz</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tracking {problems.length} problems from the NeetCode 150
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-12">
        {[...grouped.entries()].map(([category, categoryProblems]) => (
          <section key={category} className="mb-6">
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              {category}
            </h2>
            <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
              {categoryProblems.map((problem) => (
                <li
                  key={problem.slug}
                  className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm"
                >
                  <a
                    href={problem.neetcodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:underline"
                  >
                    {problem.name}
                  </a>
                  <span className={`shrink-0 text-xs ${difficultyColor[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  )
}

export default App
