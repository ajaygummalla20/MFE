# Micro-Frontend NPM Packages

A monorepo containing NPM packages for building micro-frontend architectures without iframes.

## Packages

### 📦 [@ajay_gummalla/micro-frontend-host](./packages/host)
Angular library for hosting micro-frontends (parent/container application)

### 📦 [@ajay_gummalla/micro-frontend-client](./packages/client)  
Helper utilities for child applications (React, Vue, Angular, Svelte)

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build specific package
pnpm build:host
pnpm build:client
```

## Development

```bash
# Watch mode for development
cd packages/host
pnpm dev
```

## Publishing

```bash
# Publish all packages
pnpm publish:all
```

## Architecture

```
┌─────────────────────────────────────────┐
│   Host App (Angular)                    │
│   uses @ajay_gummalla/micro-frontend-host │
├─────────────────────────────────────────┤
│                                         │
│   ┌──────────────┐  ┌──────────────┐  │
│   │ React App    │  │ Vue App      │  │
│   │ (Sales)      │  │ (Inventory)  │  │
│   └──────────────┘  └──────────────┘  │
│                                         │
│   Both use @ajay_gummalla/micro-frontend- │
│            client                       │
└─────────────────────────────────────────┘
```

## License

MIT
