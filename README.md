# NeetCode with Frenz

A shared dashboard for tracking our NeetCode 150 progress. The site runs on GitHub Pages and reads each person's public solutions repo when it loads or when you click **Refresh**.

## At a glance

| I want to… | Where to go |
| --- | --- |
| Practice problems | Submit on [NeetCode.io](https://neetcode.io/practice?tab=neetcode150). |
| Save my solutions | Use your **own public GitHub solutions repo**. Sync accepted submissions from NeetCode or push files yourself. No pull request needed. |
| Join or improve the dashboard | Open a pull request in **this shared repo** to link your solutions repo or change the site. |

## Join the dashboard

1. Use one public GitHub repo for your solutions. If NeetCode's GitHub Sync has already created one for you, use that repo. If you prefer to push files yourself, create a public repo such as `neetcode-submissions`.
2. Add your repo to [the dashboard's participant config](src/data/participants.ts) and open a pull request in the shared dashboard repo. This is a one-time setup step.

   ```ts
   { name: 'Your name', githubUsername: 'your-username', repo: 'your-repo' }
   ```

   If your problem folders live under a subfolder, add `solutionDir: 'path/to/folder'`. Leave it unset if they live at the repo root.

## Track your practice

- **With GitHub Sync**, turn on **Auto-commit** and choose **Accepted only** for automatic tracking. The dashboard counts any matching problem folder containing a file as solved, so syncing failed attempts can publish them and count them as solves. [GitHub Sync settings](https://neetcode.io/profile/github)
- **If you push files yourself**, use one folder per problem, named for the slug in the NeetCode URL. For Two Sum, save a file such as `two-integer-sum/solution.py` under your solutions directory. Any filename or extension works. The dashboard accepts case, hyphen, and underscore variations of the slug.

## Maintain the shared dashboard

Ask the repo owner for write access to help maintain the dashboard. With write access, push a feature branch to the shared repo and open a pull request there. If you’re waiting for access, you can fork the dashboard repo, push your branch to the fork, and open a pull request into the shared repo.

### Run the dashboard locally

Requires Node 20+ (this project is developed on Node 24 LTS via `nvm`).

```bash
npm install
npm run dev      # starts the dev server
npm run build    # typecheck + production build
```
