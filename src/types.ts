export interface Problem {
  slug: string
  name: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  neetcodeUrl: string
  leetcodeUrl: string
}

export interface Participant {
  name: string
  /** Omit along with repo until this person's GitHub info is known. */
  githubUsername?: string
  repo?: string
  /** Path within the repo where solutions live, e.g. "Data Structures & Algorithms" */
  solutionDir?: string
}

export function isParticipantConfigured(
  participant: Participant,
): participant is Participant & { githubUsername: string; repo: string } {
  return Boolean(participant.githubUsername && participant.repo)
}
