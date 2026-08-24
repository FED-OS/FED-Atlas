# Security Policy

## Supported Versions

Uncensored Translator is a single-file, frontend-only project. There is no
server, no backend, no database, and no network dependency. Because the entire
engine runs client-side in the browser, the attack surface is limited to the
static files themselves.

| Version | Supported          |
|---------|--------------------|
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security reports seriously, even for a small static site. If you
discover a vulnerability, please report it **privately** rather than opening a
public issue.

**How to report:**

1. **Do not** open a public GitHub issue for security-related problems.
2. Email the project maintainers with a description of the issue, the steps to
   reproduce it, and (if possible) a proof of concept. Use the private contact
   address listed in the repository profile or the `SECURITY CONTACT` note
   below.
3. If your report involves a dependency or third-party asset, include the
   specific file and version.

**What to expect:**

- We will acknowledge receipt of your report within **72 hours**.
- We will investigate and aim to provide an initial assessment within
  **7 days**.
- We will coordinate with you on disclosure timing once a fix is ready.
- We will credit reporters (with permission) in the release notes of the
  patched version.

## Scope

In scope:

- Cross-site scripting (XSS) vectors in the assembled `index.html` or any
  source file (`engine.js`, `ui.js`, `ui.html`, `styles.css`).
- Malicious or corrupted dictionary data injected via the build pipeline.
- Build / assembly script issues that could produce a broken or unsafe bundle.
- Path traversal or local file disclosure through the static file server used
  for development.

Out of scope:

- The *content* of the dictionaries. By design this project is uncensored —
  profanity, vulgarity, and slang are intentionally included. Reporting these
  as "inappropriate content" is not a security issue.
- The fact that the tool translates profanity. That is a documented, intended
  feature (see `README.md`).
- Self-XSS where a user pastes their own payload and only affects their own
  browser session.
- Vulnerabilities in third-party libraries that this project does not use
  (there are none — the project has zero runtime dependencies).

## Security Considerations by Design

A few notes that are relevant to anyone auditing this codebase:

- **No `innerHTML` of untrusted translation output.** The UI renders
  translation results as text nodes, not as HTML, to prevent translated strings
  (which could contain angle brackets or markup-like characters) from being
  interpreted as live HTML.
- **No network calls at runtime.** The engine is a pure in-browser dictionary.
  There are no `fetch`, `XMLHttpRequest`, WebSocket, or beacon calls in the
  shipped file. The only "network" is when a user loads the page from a static
  host.
- **No `eval` of user input.** User text is tokenized and looked up in
  dictionaries; it is never evaluated as code.
- **No external dependencies.** No npm packages, no CDNs, no analytics, no
  fonts loaded from a remote server at runtime. Everything is inlined.

If any of these guarantees are ever violated by a change, that is a regression
and should be reported.

## SECURITY CONTACT

Replace the placeholder below with your project's actual private contact
address (ideally a dedicated security mailbox or a GitHub security advisory).

> **Private reports:** open a
> [GitHub Security Advisory](https://github.com/your-org/uncensored-translator/security/advisories/new)
> or email the maintainers directly. Public issues for security problems will
> be closed and redirected.
