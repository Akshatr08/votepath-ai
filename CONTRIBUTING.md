# Contributing to VotePath AI

Thank you for your interest in contributing to VotePath AI! We are dedicated to providing clear, non-partisan election information to voters worldwide.

## 🛡️ Our Standards

We maintain a strict **100% Quality Standard** across all metrics:
- **Code Quality:** Zero ESLint warnings or errors.
- **Testing:** Minimum 95% unit/integration test coverage.
- **Security:** All inputs must be sanitized, and CSP headers must be respected.
- **Accessibility:** Components must follow WCAG 2.1 Level AA standards.

## 🚀 Development Workflow

1. **Fork the repo** and create your branch from `main`.
2. **Install dependencies**: `npm install`.
3. **Run Linting**: `npm run lint`.
4. **Run Tests**: `npm run test:coverage`.
5. **Ensure Build Passes**: `npm run build`.

## 🧪 Testing Guidelines

- Every new feature must include corresponding tests in `src/tests/`.
- We use **Vitest** and **React Testing Library**.
- Mock external services (Google Cloud, Firebase) using the patterns established in `src/tests/google-cloud.test.ts`.

## 💬 Community

If you have questions or suggestions, please open an issue or start a discussion. Let's build a more informed democracy together!
