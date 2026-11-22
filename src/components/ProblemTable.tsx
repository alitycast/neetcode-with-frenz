import { isParticipantConfigured, type Participant, type Problem } from '../types'

interface ProblemTableProps {
  problems: Problem[]
  participants: Participant[]
  completionByParticipant: Record<string, Set<string>>
}

const difficultyColor: Record<Problem['difficulty'], string> = {
  Easy: 'text-green-600 dark:text-green-400',
  Medium: 'text-yellow-600 dark:text-yellow-400',
  Hard: 'text-red-600 dark:text-red-400',
}

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

export function ProblemTable({ problems, participants, completionByParticipant }: ProblemTableProps) {
  const grouped = groupByCategory(problems)

  return (
    <>
      <div className="mb-2 flex items-center justify-end gap-4 px-4 text-xs font-medium text-slate-400">
        <span className="w-14 text-right">Difficulty</span>
        {participants.map((participant) => (
          <span key={participant.name} className="w-6 text-center" title={participant.name}>
            {participant.name.slice(0, 2)}
          </span>
        ))}
      </div>

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
                <div className="flex shrink-0 items-center gap-4">
                  <span className={`w-14 text-right text-xs ${difficultyColor[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                  {participants.map((participant) => {
                    if (!isParticipantConfigured(participant)) {
                      return (
                        <span
                          key={participant.name}
                          title={`${participant.name}: GitHub info not added yet`}
                          className="w-6 text-center text-slate-300 dark:text-slate-700"
                        >
                          –
                        </span>
                      )
                    }
                    const isComplete = completionByParticipant[participant.name]?.has(problem.slug)
                    return (
                      <span
                        key={participant.name}
                        title={participant.name}
                        className={`w-6 text-center ${
                          isComplete
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      >
                        {isComplete ? '✓' : '○'}
                      </span>
                    )
                  })}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
