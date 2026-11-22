import { useCallback, useEffect, useState } from 'react'
import { ProblemTable } from './components/ProblemTable'
import { participants } from './data/participants'
import problemsData from './data/problems.json'
import { fetchParticipantGithubData, GitHubApiError } from './services/github'
import { isParticipantConfigured, type Problem } from './types'
import { buildCompletionSet } from './utils/problemMatcher'

const problems = problemsData as Problem[]
const configuredParticipants = participants.filter(isParticipantConfigured)

interface ParticipantError {
  participantName: string
  message: string
}

function formatLastSubmission(date: Date | null): string {
  if (!date) return 'No submissions yet'
  return `Last submission: ${date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}`
}

function App() {
  const [completionByParticipant, setCompletionByParticipant] = useState<Record<string, Set<string>>>({})
  const [lastSubmission, setLastSubmission] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ParticipantError[]>([])

  const refresh = useCallback(async () => {
    setLoading(true)
    setErrors([])

    const results = await Promise.allSettled(
      configuredParticipants.map((participant) => fetchParticipantGithubData(participant)),
    )

    const nextCompletion: Record<string, Set<string>> = {}
    const nextErrors: ParticipantError[] = []
    let latest: Date | null = null

    results.forEach((result, index) => {
      const participant = configuredParticipants[index]
      if (result.status === 'fulfilled') {
        nextCompletion[participant.name] = buildCompletionSet(problems, result.value.folderNames)
        const commitDate = result.value.lastSolutionCommitDate
        if (commitDate && (!latest || commitDate > latest)) {
          latest = commitDate
        }
      } else {
        const message =
          result.reason instanceof GitHubApiError
            ? result.reason.message
            : 'Unexpected error fetching GitHub data.'
        nextErrors.push({ participantName: participant.name, message })
      }
    })

    setCompletionByParticipant(nextCompletion)
    setLastSubmission(latest)
    setErrors(nextErrors)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="mx-auto max-w-3xl px-4 pt-8 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">NeetCode with Frenz</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Tracking {problems.length} problems from the NeetCode 150
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {formatLastSubmission(lastSubmission)}
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 space-y-1 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {errors.map((e) => (
              <p key={e.participantName}>
                {e.participantName}: {e.message}
              </p>
            ))}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-12">
        <ProblemTable
          problems={problems}
          participants={participants}
          completionByParticipant={completionByParticipant}
        />
      </main>
    </div>
  )
}

export default App
