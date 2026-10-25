# Security Policy

## Supported Versions

BetterPuertoPrincesa.org is a single continuously-deployed website, not a versioned library — only the version currently live on `main` (production) is supported. Older tagged releases are not patched retroactively.

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability, please report it responsibly.

### How to report

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, use GitHub's private reporting: go to the [Security tab](https://github.com/hmcldryl/betterpuertoprincesa/security/advisories) of this repository and click **"Report a vulnerability"**. This opens a private advisory visible only to maintainers.

Include in your report:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response timeline

| Action             | Timeframe                                            |
| ------------------ | ---------------------------------------------------- |
| Acknowledgment     | Within 7 days                                        |
| Initial assessment | Within 14 days                                       |
| Resolution target  | Best effort — this is a volunteer-maintained project |
| Public disclosure  | After a fix is deployed                              |

## Security measures

**Hosting & transport:**

- Hosted on Vercel — HTTPS/TLS and HSTS are enforced by the platform, not custom server config
- Deploys are gated behind CI (`.github/workflows/ci.yml`) and, for production, [semantic-release](https://semantic-release.gitbook.io/) on `main` (`.github/workflows/release.yml`)

**Application security:**

- No user authentication and no user accounts
- No database — content comes from static Markdown/YAML files (`content/`) and TypeScript data files (`src/data/`) committed to the repo
- Client-rendered SPA (React + Vite); the few components that call external APIs do so directly from the browser (see below)
- No forms that collect or store personal data

**Data security:**

- All civic/municipal data is sourced from official government sources or cited public reporting — see the source notes in `src/data/` for provenance
- No personally identifiable information (PII) is collected or stored by the site itself

### Third-party services

| Service                                | Purpose                                    | Data shared                                      |
| -------------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| Open-Meteo API                         | Weather widget                             | Fixed lat/lon for Puerto Princesa (no user data) |
| OpenFreeMap tiles (OpenStreetMap data) | Map tiles and fonts for the maps           | None                                             |
| Global Forest Watch tiles              | Tree cover loss overlay (Mining Watch map) | None                                             |
| Google Fonts CDN (if used)             | Fonts                                      | Standard request metadata (IP, user agent)       |

The site has no analytics or tracking script.

## Best practices for contributors

1. **Never commit secrets** — the site currently requires no API keys or environment variables; if a future change introduces one, it belongs in an untracked `.env.local`, never in code.
2. **Validate inputs** — sanitize anything rendered from user-controllable input (currently minimal, since there are no forms, but keep this in mind for future features).
3. **HTTPS only** — all external resources (fonts, tiles, APIs) must be loaded over HTTPS.
4. **Review dependencies** — check `npm audit` before adding new packages.
5. **Don't bypass CI** — never use `--no-verify` to skip git hooks or force a lint/build failure through.

## Scope

This policy covers:

- The BetterPuertoPrincesa.org website and its GitHub repository
- Associated build tooling and GitHub Actions workflows

Out of scope:

- Third-party services listed above (report to them directly)
- Vercel's own platform infrastructure

## Contact

Report privately via [GitHub Security Advisories](https://github.com/hmcldryl/betterpuertoprincesa/security/advisories).

General inquiries: open a GitHub issue or join the [BetterPuertoPrincesa Discord](https://discord.gg/DzwTq7MjfS).

---

Thank you for helping keep BetterPuertoPrincesa.org secure for the people of Puerto Princesa.
