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

## Features

### Current (v1.x)
✅ **No iframes** - Direct DOM mounting for better performance  
✅ **Framework agnostic** - Support for React, Vue, Angular, Svelte  
✅ **TypeScript first** - Full type definitions included  
✅ **Easy integration** - Simple API for both host and clients  
✅ **Standalone & NgModule** - Support for both Angular architectures  
✅ **Route-based loading** - Load micro-frontends via Angular routing  
✅ **Props & events** - Pass data and communicate between apps  

## Roadmap

### v2.0.0 - Lazy Loading & Module Federation (Planned)
🔄 **Route-level lazy loading** - Load only specific routes/chunks instead of entire apps  
🔄 **Webpack Module Federation** - Native module federation support  
🔄 **Chunk mapping** - Configure route-to-chunk mappings  
🔄 **Code splitting optimization** - Better bundle size management  
🔄 **Enhanced configuration** - More granular control over loading strategies  

### v3.0.0 - Performance & DevEx (Future)
🔜 **Smart preloading** - Intelligent prefetching of likely routes  
🔜 **Performance monitoring** - Built-in metrics and analytics  
🔜 **Developer tools** - Browser extension for debugging  
🔜 **Hot module replacement** - HMR support for micro-frontends  
🔜 **Shared dependencies** - Optimize common library loading  

### Community Requests
Have a feature request? [Open an issue](https://github.com/ajaygummalla20/MFE/issues/new) on GitHub!

## Documentation

- 📖 [Getting Started Guide](./GETTING_STARTED.md)
- 📦 [Host Package Documentation](./packages/host/README.md)
- 📦 [Client Package Documentation](./packages/client/README.md)
- 💡 [Usage Examples](./examples/README.md)
- 🚀 [Publishing Guide](./PUBLISH.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- 📖 [Documentation](./GETTING_STARTED.md)
- 💬 [GitHub Issues](https://github.com/ajaygummalla20/MFE/issues)
- 🔗 [NPM Packages](https://www.npmjs.com/~ajay_gummalla)

## License

MIT
