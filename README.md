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

## Join the dashboard

1. Create a [NeetCode account](https://neetcode.io) and a public GitHub repo for your solutions. You can use any repo name, such as `neetcode-submissions`.
2. Add your repo to [the dashboard's participant config](src/data/participants.ts) and open a pull request in the shared dashboard repo. This is a one-time setup step.

   ```ts
   { name: 'Your name', githubUsername: 'your-username', repo: 'your-repo' }
   ```

   If your problem folders live under a subfolder, add `solutionDir: 'path/to/folder'`. Leave it unset if they live at the repo root.

## Track your practice

Work through the [NeetCode 150 list](https://neetcode.io/practice?tab=neetcode150) and push your solutions to your own public solutions repo. The dashboard picks them up on load or when you click **Refresh**. Solving a problem never needs a pull request.

If you use NeetCode's GitHub Sync, set the status filter to **Accepted only**. Your solutions repo is public, and the dashboard counts any matching problem folder containing a file as solved. Syncing all submissions can publish failed attempts and mark those problems as solved. [GitHub Sync settings](https://neetcode.io/profile/github)

Use one folder per problem, named for the slug in the NeetCode problem URL. For Two Sum, save a file such as `two-integer-sum/solution.py` under your solutions directory. Any filename or extension works. The dashboard accepts case, hyphen, and underscore variations of the NeetCode slug.

## Maintain the shared dashboard

Ask the repo owner for write access to help maintain the dashboard. With write access, push a feature branch to the shared repo and open a pull request there. If you’re waiting for access, you can fork the dashboard repo, push your branch to the fork, and open a pull request into the shared repo.
