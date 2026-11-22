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
  githubUsername: string
  repo: string
  /** Path within the repo where solutions live, e.g. "Data Structures & Algorithms" */
  solutionDir?: string
}
