# Getting Started

Welcome to the Micro-Frontend NPM Packages monorepo!

## What You Have

This project contains **TWO NPM packages** that enable micro-frontend architecture:

### 1. @mfe/micro-frontend-host
**For Parent/Host Applications (Angular)**

Install in your main Angular app to load external micro-frontends:
```bash
npm install @mfe/micro-frontend-host
```

### 2. @mfe/micro-frontend-client  
**For Child Applications (React/Vue/Angular/Svelte)**

Install in your micro-frontend apps:
```bash
npm install @mfe/micro-frontend-client
```

## Quick Setup

### Build Packages
```bash
pnpm install
pnpm build
```

### Package Structure
```
packages/
├── host/                 # @mfe/micro-frontend-host
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/      # DynamicAppLoaderComponent
│   │   │   ├── services/        # ExternalAppLoaderService
│   │   │   ├── modules/         # MicroFrontendHostModule
│   │   │   ├── models/          # TypeScript interfaces
│   │   │   └── utils/           # Route generators
│   │   └── index.ts             # Public API
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── client/               # @mfe/micro-frontend-client
    ├── src/
    │   ├── core/               # Core types & lifecycle
    │   ├── frameworks/
    │   │   ├── react.ts        # React helpers
    │   │   ├── vue.ts          # Vue helpers
    │   │   └── vanilla.ts      # Vanilla JS helpers
    │   └── index.ts            # Public API
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

## How It Works

```
┌─────────────────────────────────────────────┐
│   Angular Host App (Port 4200)             │
│   Uses: @mfe/micro-frontend-host    │
│                                             │
│   URL: http://localhost:4200/home/sales    │
├─────────────────────────────────────────────┤
│                                             │
│   ┌──────────────────┐  ┌────────────────┐│
│   │ React App        │  │ Vue App        ││
│   │ (Port 4601)      │  │ (Port 4602)    ││
│   │ Sales Dashboard  │  │ Inventory      ││
│   │                  │  │                ││
│   │ Uses: client pkg │  │ Uses: client   ││
│   └──────────────────┘  └────────────────┘│
│                                             │
│   Both loaded WITHOUT iframes!             │
│   Same parent URL, no iframe limitations   │
└─────────────────────────────────────────────┘
```

## Example Usage

### Angular Host App

#### Option 1: NgModule-based App (Angular < 14 or using modules)

**Step 1: Import module in app.module.ts**
```typescript
// app.module.ts
import { MicroFrontendHostModule } from '@mfe/micro-frontend-host';

@NgModule({
  imports: [MicroFrontendHostModule]
})
export class AppModule { }
```

**Step 2: Configure routes in app-routing.module.ts**
```typescript
// app-routing.module.ts
import { DynamicAppLoaderComponent } from '@mfe/micro-frontend-host';

const routes = [
  {
    path: 'sales',
    component: DynamicAppLoaderComponent,
    data: {
      appName: 'salesDashboard',
      scriptUrl: 'http://localhost:4601/main.js',
      props: { title: 'Sales Dashboard' }
    }
  }
];
```

#### Option 2: Standalone App (Angular 14+ without NgModule)

**Configure everything in main.ts (no separate routing file needed)**
```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { DynamicAppLoaderComponent, ExternalAppLoaderService } from '@mfe/micro-frontend-host';

bootstrapApplication(AppComponent, {
  providers: [
    ExternalAppLoaderService,
    provideRouter([
      {
        path: 'sales',
        component: DynamicAppLoaderComponent,
        data: {
          appName: 'salesDashboard',
          scriptUrl: 'http://localhost:4601/main.js',
          props: { title: 'Sales Dashboard' }
        }
      }
    ])
  ]
});
```

**Or split configuration into app.config.ts (cleaner approach)**
```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DynamicAppLoaderComponent, ExternalAppLoaderService } from '@mfe/micro-frontend-host';

export const appConfig: ApplicationConfig = {
  providers: [
    ExternalAppLoaderService,
    provideRouter([
      {
        path: 'sales',
        component: DynamicAppLoaderComponent,
        data: {
          appName: 'salesDashboard',
          scriptUrl: 'http://localhost:4601/main.js',
          props: { title: 'Sales Dashboard' }
        }
      }
    ])
  ]
};
```

**Then use it in main.ts:**
```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
```

### React Child App

```javascript
// index.js
import { createReactMicroFrontend } from '@mfe/micro-frontend-client/react';
import App from './App';

createReactMicroFrontend({
  name: 'salesDashboard',
  rootComponent: App,
  React,
  ReactDOM
});
```

### Vue Child App

```javascript
// main.js
import { createVueMicroFrontend } from '@mfe/micro-frontend-client/vue';
import App from './App.vue';

createVueMicroFrontend({
  name: 'inventoryApp',
  createApp,
  rootComponent: App
});
```

## Development Workflow

### 1. Build packages
```bash
pnpm build
```

### 2. Watch mode (during development)
```bash
cd packages/host
pnpm dev  # Watches for changes
```

### 3. Test locally
```bash
cd packages/host
npm link

# In your test Angular project
npm link @mfe/micro-frontend-host
```

## Publishing to NPM

See [PUBLISH.md](./PUBLISH.md) for detailed publishing instructions.

Quick publish:
```bash
pnpm build
pnpm publish:all
```

## Documentation

- [Root README](./README.md) - Monorepo overview
- [Host Package README](./packages/host/README.md) - Angular host package documentation
- [Client Package README](./packages/client/README.md) - Client helpers documentation
- [Examples](./examples/README.md) - Complete usage examples
- [Publishing Guide](./PUBLISH.md) - How to publish to NPM

## Benefits

✅ **No iframes** - Direct DOM mounting  
✅ **Framework agnostic** - Works with React, Vue, Angular, Svelte  
✅ **TypeScript first** - Full type support  
✅ **Easy integration** - Simple API 
✅ **Shared URL** - All apps under same domain  
✅ **Production ready** - Built for enterprise use  

## Support

- 📖 [Documentation](./README.md)  
- 💬 [Issues](https://github.com/mfe/micro-frontend-packages/issues)  
- 🚀 [Examples](./examples/)  

## License

MIT

---

**Ready to use?** Check out the [examples](./examples/README.md) to get started!
