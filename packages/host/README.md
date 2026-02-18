# @mfe/micro-frontend-host

[![npm version](https://img.shields.io/npm/v/@mfe/micro-frontend-host.svg)](https://www.npmjs.com/package/@mfe/micro-frontend-host)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Angular library for hosting micro-frontends from any framework (React, Vue, Angular, Svelte) without using iframes.

## Installation

```bash
npm install @mfe/micro-frontend-host
# or
pnpm add @mfe/micro-frontend-host
# or
yarn add @mfe/micro-frontend-host
```

## Quick Start

### Option 1: NgModule-based App

#### 1. Import Module

```typescript
import { MicroFrontendHostModule } from '@mfe/micro-frontend-host';

@NgModule({
  imports: [
    MicroFrontendHostModule
  ]
})
export class AppModule { }
```

#### 2. Configure Routes

```typescript
import { DynamicAppLoaderComponent } from '@mfe/micro-frontend-host';

const routes: Routes = [
  {
    path: 'sales',
    component: DynamicAppLoaderComponent,
    data: {
      appName: 'salesDashboard',
      scriptUrl: 'http://localhost:4601/main.js',
      cssUrl: 'http://localhost:4601/styles.css',
      props: {
        title: 'Sales Dashboard',
        apiUrl: environment.apiUrl
      }
    }
  }
];
```

### Option 2: Standalone App (Angular 14+)

#### 1. Configure in main.ts or app.config.ts

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DynamicAppLoaderComponent, ExternalAppLoaderService } from '@mfe/micro-frontend-host';
import { AppComponent } from './app/app.component';

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
          cssUrl: 'http://localhost:4601/styles.css',
          props: {
            title: 'Sales Dashboard'
          }
        }
      }
    ])
  ]
});
```

### 3. Navigate

Navigate to `/sales` and your external app loads seamlessly!

## Using Route Generator

```typescript
import { generateMicroFrontendRoutes } from '@mfe/micro-frontend-host';

const routes = generateMicroFrontendRoutes([
  {
    path: 'sales',
    appName: 'salesDashboard',
    scriptUrl: environment.salesUrl + '/main.js',
    props: { title: 'Sales' }
  },
  {
    path: 'inventory',
    appName: 'inventoryApp',
    scriptUrl: environment.inventoryUrl + '/main.js'
  }
]);
```

## Preloading Apps

```typescript
import { ExternalAppLoaderService } from '@mfe/micro-frontend-host';

constructor(private appLoader: ExternalAppLoaderService) {
  this.appLoader.preloadApps([
    { appName: 'salesDashboard', scriptUrl: '...' }
  ]);
}
```

## API

### ExternalAppLoaderService

- `loadExternalApp(config)` - Load an external app
- `loadExternalStyles(cssUrl)` - Load CSS
- `preloadApps(configs)` - Preload multiple apps
- `isAppLoaded(appName)` - Check loading status
- `clearApp(appName)` - Clear from cache

### DynamicAppLoaderComponent

Component for rendering micro-frontends.

### Types

```typescript
import {
  MicroFrontendConfig,
  MicroFrontendRouteConfig,
  MicroFrontendMountProps,
  LoadedMicroFrontend
} from '@mfe/micro-frontend-host';
```

## External App Requirements

Your external apps must expose:

```javascript
window.yourAppName = {
  mount: (props) => {
    // Render app
    return appInstance;
  },
  unmount: (instance) => {
    // Cleanup
  }
};
```

See [@mfe/micro-frontend-client](https://www.npmjs.com/package/@mfe/micro-frontend-client) for helpers.

## License

MIT
