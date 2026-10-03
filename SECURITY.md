# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Code-View seriously. If you discover a security vulnerability, we appreciate your help in disclosing it to us responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following:

1. **GitHub Security Advisories**: Use [GitHub's private vulnerability reporting](https://github.com/prathamesh424/Code-view/security/advisories/new) to create a confidential report.
2. **Direct Contact**: Reach out to the maintainer at **[prathamesh424](https://github.com/prathamesh424)** via GitHub.

### What to Include

Please include as much of the following information as possible:

- **Type of vulnerability** (e.g., XSS, injection, data exposure)
- **Location of the affected source code** (file path, line numbers)
- **Steps to reproduce** the vulnerability
- **Proof of concept** or exploit code (if possible)
- **Impact assessment** — what an attacker could achieve

### Response Timeline

- **Acknowledgment**: Within 48 hours of receipt
- **Initial assessment**: Within 1 week
- **Fix timeline**: Depending on severity, typically within 2–4 weeks

### Security Considerations

Code-View is primarily a client-side educational tool. However, we still take security seriously:

- **SQL Playground**: Runs entirely in-browser via WebAssembly (sql.js). No server-side database access.
- **Code Execution**: Visualizers parse and simulate code execution client-side. No arbitrary code is executed on any server.
- **Third-party Dependencies**: We regularly audit and update dependencies to patch known vulnerabilities.
- **User Data**: Feedback submissions are stored via Convex (cloud backend). No passwords or sensitive personal data are collected.

### Out of Scope

The following are generally **not** considered vulnerabilities for this project:

- Issues in third-party dependencies that don't affect Code-View's usage
- Denial of Service attacks against the client-side application
- Social engineering attacks
- Issues requiring physical access to the user's device

## Recognition

We appreciate the security research community's efforts in helping keep Code-View safe. Reporters of valid vulnerabilities will be:

- Credited in the security advisory (unless they prefer to remain anonymous)
- Mentioned in the release notes for the fix
- Added to our contributors list

Thank you for helping keep Code-View and its users safe! 🛡️
