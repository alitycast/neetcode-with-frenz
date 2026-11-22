# NeetCode with Frenz

A shared dashboard that tracks which NeetCode 150 problems each of us has solved, by reading our public GitHub solution repos. No backend, no login — static site hosted on GitHub Pages.

## Local setup

Requires Node 20+ (this project is developed on Node 24 LTS via `nvm`).

```bash
npm install
npm run dev      # starts the dev server
npm run build    # typecheck + production build
```

## How it works

Each person is listed in [`src/data/participants.ts`](src/data/participants.ts) with their GitHub username and solutions repo. On load (and on Refresh), the app reads each repo's file tree from the GitHub API and checks, for every NeetCode 150 problem, whether a matching solution folder exists.

## Joining as a contributor (Ali, Layla)

1. **Create a NeetCode account** at [neetcode.io](https://neetcode.io) and work through the [NeetCode 150 list](https://neetcode.io/practice?tab=neetcode150).
2. **Create a public GitHub repo** to hold your solutions (any name, e.g. `neetcode-submissions`). It must be public — the dashboard can't read private repos.
3. **Upload each solution** as a file inside a folder named after that problem's **NeetCode slug** — not the LeetCode one. Find it in the URL on the problem's NeetCode page: `neetcode.io/problems/<this-part>`.

   Example — solving "Two Sum" (NeetCode slug `two-integer-sum`):

   ```
   <your-repo>/
   └── <your-solutions-folder>/
       └── two-integer-sum/
           └── solution.py        (any filename/extension is fine)
   ```

   One folder per problem; a folder just needs *any* file in it to count as solved. Matching is forgiving about case/hyphens/underscores, but the folder name has to be the actual NeetCode slug — a LeetCode slug or a made-up name won't match.

4. **Open a PR against this repo** adding yourself to [`src/data/participants.ts`](src/data/participants.ts):

   ```ts
   { name: 'Ali', githubUsername: 'your-username', repo: 'your-repo', solutionDir: 'optional/subfolder' }
   ```

   Omit `solutionDir` if your solutions sit at the repo root. Fork this repo, add your entry, and open a pull request.
