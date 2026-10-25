# Contributing to BetterPuertoPrincesa.org

Thanks for wanting to help. This is a volunteer-built civic transparency portal for Puerto Princesa City, Palawan — contributions from developers, designers, translators, and residents who just know the city well are all welcome.

## Stack

- **React 19 + TypeScript**, built with **Vite 7**, deployed on **Vercel**
- **React Router v7** for routing
- **Tailwind CSS v4** (CSS-first `@theme` config in `src/index.css`: balayong pink, bay blue, Young Serif + Atkinson Hyperlegible Next)
- **`content/**/_.md`+`_.yaml`** for service and government department pages, **`src/data/`\*\* for statistics, news, hotlines, and budget data — no database, no CMS; matches how BetterGov.ph and other BetterLGU sites store data
- **i18next** (English/Filipino) with translation JSON loaded from `public/locales/`
- **MapLibre GL** + OpenFreeMap vector tiles (no API key) for the maps, **Open-Meteo** for live weather
- GitHub Actions → Vercel CLI for CI/CD (`.github/workflows/ci.yml`, `deploy.yml`, `release.yml`)
- Conventional Commits + semantic-release for versioning (see below)

## Branching model

Trunk-based — one long-lived branch:

| Branch | Environment                                          | Purpose                                               |
| ------ | ---------------------------------------------------- | ----------------------------------------------------- |
| `main` | Production — https://betterpuertoprincesa.vercel.app | Default branch. All feature/fix branches target this. |

Workflow:

1. Branch off `main`: `git checkout -b feat/short-description`
2. Open a PR into `main`. CI (`npm run lint` + `npm run build`) must pass — see `.github/workflows/ci.yml` — and you get an ephemeral Vercel preview URL commented on the PR (`.github/workflows/deploy.yml`).
3. Merging runs [semantic-release](https://semantic-release.gitbook.io/): bumps the version, writes `CHANGELOG.md`, tags a GitHub Release, and deploys to production (see `.github/workflows/release.yml`).

No manual version bumping — versions derive entirely from commit messages (see below). `main` is a protected branch (PR required, the `lint-and-build` check must pass on an up-to-date branch, no force-pushes or deletion) — a PR is the only way in for contributors. Repository admins can bypass it, which is what lets semantic-release push its version-bump commit.

**Never hand-edit `package.json`'s version or push a tag directly to `main`.** If a version needs to jump outside normal bumping, do it as a real commit with a `BREAKING CHANGE:` footer through a normal PR instead, so semantic-release computes it.

## Getting started

Prerequisites: Node.js 24+, npm.

```bash
git clone https://github.com/hmcldryl/betterpuertoprincesa.git
cd betterpuertoprincesa
npm install          # also installs git hooks (husky "prepare" script)
npm run dev          # http://localhost:5173
```

```bash
npm run build    # tsc -b && vite build
npm run lint     # ESLint
npm run format   # Prettier, writes changes
```

No environment variables are needed to run the site locally.

A pre-commit hook (`.husky/pre-commit` → `lint-staged`) runs ESLint and Prettier on staged files automatically.

## How to contribute

### Reporting bugs

1. Check existing [issues](https://github.com/hmcldryl/betterpuertoprincesa/issues) to avoid duplicates.
2. Open a new issue with a clear title, steps to reproduce, expected vs. actual behavior, and a screenshot if it's visual.

### Suggesting features

Open an issue describing the feature, who it helps, and why. Mockups or examples are a bonus, not a requirement.

### Submitting code

1. **Fork** the repository.
2. **Branch** off `main`:
   ```bash
   git checkout main && git pull
   git checkout -b feat/your-feature-name
   ```
3. **Make** your changes.
4. **Commit** using Conventional Commits — this is enforced locally by a commit-msg git hook (`.husky/commit-msg` + `commitlint.config.js`), so a badly-formatted commit just won't go through.
   ```bash
   git commit -m "feat: add brief description of your change"
   ```
5. **Push** to your fork and **open a Pull Request into `main`**.

### Submitting content — no coding required

Content edits (fixing an outdated phone number, adding a missing service page, correcting a fee) don't need Git at all — you can edit Markdown files directly from GitHub's web UI. See **[docs/content-management.md](docs/content-management.md)** for a complete, no-technical-knowledge walkthrough, and **[docs/content-guide.md](docs/content-guide.md)** for writing style and page templates.

### Commit message format (Conventional Commits)

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

The subject must start lowercase (no sentence-case, start-case, or PascalCase).

| Type       | Effect on version              | Use for                                |
| ---------- | ------------------------------ | -------------------------------------- |
| `feat`     | minor bump (`1.2.0` → `1.3.0`) | New feature or page                    |
| `fix`      | patch bump (`1.2.0` → `1.2.1`) | Bug fix                                |
| `perf`     | patch bump                     | Performance improvement                |
| `docs`     | no bump                        | Documentation only                     |
| `style`    | no bump                        | Formatting/CSS, no logic change        |
| `refactor` | no bump                        | Code restructuring, no behavior change |
| `test`     | no bump                        | Adding or fixing tests                 |
| `build`    | no bump                        | Build tooling, dependencies            |
| `ci`       | no bump                        | GitHub Actions / CI config             |
| `chore`    | no bump                        | Maintenance, no production code change |
| `revert`   | patch bump                     | Reverting a previous commit            |

Add `BREAKING CHANGE: <description>` in the footer (or `!` after the type, e.g. `feat!:`) for a **major** bump.

Examples:

```
feat(services): add online business permit renewal page
fix(footer): correct social icon alignment on mobile
docs: explain the trunk-based branching model in the README
```

## Contribution areas

| Area          | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| Bug fixes     | Fix reported issues                                                    |
| Features      | New pages, components, or functionality                                |
| Content       | Update service/department info in `content/` (fees, offices, times)    |
| Translations  | English/Filipino strings live in `public/locales/{en,fil}/common.json` |
| Design        | UI/UX and accessibility improvements                                   |
| Data          | Verify and update the files in `src/data/`                             |
| Documentation | Improve this guide, the README, or the guides in `docs/`               |

## Data policy — read this before touching `content/` or `src/data/`

**Never fabricate or guess civic data** — official names, statistics, fees, ordinances, contact info. If you can't verify a value against an official source (the Puerto Princesa City LGU, the Sangguniang Panlungsod, PSA, DILG, COMELEC, or a department's own Citizen's Charter), leave it out rather than guess.

When you do add a real value, cite where it came from — a source note next to the data, the same way the existing `src/data/` files do, and in the PR description.

## Code guidelines

- **TypeScript/React**: match the existing style in the file you're editing.
- **Styling**: Tailwind CSS v4 utility classes; reuse the primitives in `src/components/ui/` (`Section`, `Heading`, `Text`, `Breadcrumbs`, ...) instead of raw HTML where one exists.
- **Content system**: a new service or government _category_ must be registered in `src/data/{services,government}.yaml` and `src/data/yamlLoader.ts` — a category that's only added to `content/` won't be picked up.
- **i18n**: any new UI copy needs a key in both `public/locales/en/common.json` and `public/locales/fil/common.json`, wired through `useTranslation('common')`. Markdown content in `content/` is not translated per-string; see [docs/content-guide.md](docs/content-guide.md).
- **Accessibility**: semantic HTML, `aria-label`s on icon-only buttons/links, keyboard-navigable interactive elements.
- **Mobile**: check your change at a narrow viewport (≤ 400px) before opening a PR — this is a civic site many residents will hit on a phone.

## Pull request process

1. Make sure `npm run lint` and `npm run build` pass locally.
2. Fill out the PR description — what changed and why, and link any related issue.
3. PRs into `main` get an ephemeral Vercel preview URL commented automatically; use it to sanity-check the change live.
4. Wait for review and address feedback.

## Review criteria

- Correctness and no regressions
- Data accuracy and sourcing (for `content/` or `src/data/` changes)
- Accessibility and mobile responsiveness
- Code style consistency with the surrounding file

## Community

- **Facebook:** https://www.facebook.com/betterpuertoprincesa
- **Discord:** https://discord.gg/CTtjDCUgca (BetterPuertoPrincesa)
- **BetterGov.ph Discord:** https://discord.gg/bettergovph

## Questions?

Open an issue, message us on Facebook, or ask on our Discord — happy to help.

---

Thank you for helping make Puerto Princesa's local government more transparent and accessible.
