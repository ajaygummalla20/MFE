# Publishing Guide

## Prerequisites

1. npm account (https://www.npmjs.com/)
2. Organization created: @mfe
3. Logged in to npm: `npm login`

## Publishing Steps

### First Time Setup

1. **Create npm organization:**
```bash
npm org create mfe
```

2. **Update package access:**
```bash
npm access public @ajay_gummalla/micro-frontend-host
npm access public @ajay_gummalla/micro-frontend-client
```

### Publishing Packages

#### Publish Both Packages
```bash
# Build first
pnpm build

# Publish all
pnpm publish:all
```

#### Publish Individual Packages

**Host Package:**
```bash
cd packages/host
npm publish --access public
```

**Client Package:**
```bash
cd packages/client
npm publish --access public
```

### Version Updates

```bash
# Update version in package.json files
cd packages/host
npm version patch  # or minor, major

cd packages/client
npm version patch

# Build and publish
cd ../..
pnpm build
pnpm publish:all
```

## Testing Before Publishing

1. **Local linking:**
```bash
# In host package
cd packages/host
npm link

# In test project
npm link @ajay_gummalla/micro-frontend-host
```

2. **Pack and test:**
```bash
cd packages/host
npm pack
# Installs .tgz file in test project
npm install ../path/to/mfe-micro-frontend-host-1.0.0.tgz
```

## After Publishing

1. **Verify on npm:**
- https://www.npmjs.com/package/@ajay_gummalla/micro-frontend-host
- https://www.npmjs.com/package/@ajay_gummalla/micro-frontend-client

2. **Test installation:**
```bash
npm install @ajay_gummalla/micro-frontend-host
npm install @ajay_gummalla/micro-frontend-client
```

## Automated Publishing (CI/CD Automated Publishing (CI/CD)

### GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Packages

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: pnpm install
      - run: pnpm build
      - run: pnpm publish:all
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

**Permission denied:**
```bash
npm login
npm whoami
```

**Package already exists:**
- Update version number
- Check npm registry

**Build errors:**
```bash
pnpm clean
pnpm install
pnpm build
```
