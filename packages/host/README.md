# @ajay_gummalla/micro-frontend-host

[![npm version](https://img.shields.io/npm/v/@ajay_gummalla/micro-frontend-host.svg)](https://www.npmjs.com/package/@ajay_gummalla/micro-frontend-host)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Angular library for hosting micro-frontends from any framework (React, Vue, Angular, Svelte) without using iframes.

## Installation

```bash
npm install @ajay_gummalla/micro-frontend-host
# or
pnpm add @ajay_gummalla/micro-frontend-host
# or
yarn add @ajay_gummalla/micro-frontend-host
```

## Quick Start

### Option 1: NgModule-based App

#### 1. Import Module

```typescript
import { MicroFrontendHostModule } from '@ajay_gummalla/micro-frontend-host';

@NgModule({
  imports: [
    MicroFrontendHostModule
  ]
})
export class AppModule { }
```

#### 2. Configure Routes

```typescript
import { DynamicAppLoaderComponent } from '@ajay_gummalla/micro-frontend-host';

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
import { DynamicAppLoaderComponent, ExternalAppLoaderService } from '@ajay_gummalla/micro-frontend-host';
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
import { generateMicroFrontendRoutes } from '@ajay_gummalla/micro-frontend-host';

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
import { ExternalAppLoaderService } from '@ajay_gummalla/micro-frontend-host';

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
} from '@ajay_gummalla/micro-frontend-host';
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

See [@ajay_gummalla/micro-frontend-client](https://www.npmjs.com/package/@ajay_gummalla/micro-frontend-client) for helpers.

## Contributing

Contributions, suggestions, and improvements are welcome! If you have ideas for new features, bug fixes, or enhancements, please feel free to:

- **Open an issue** on [GitHub](https://github.com/ajaygummalla20/MFE/issues) to report bugs or suggest features
- **Submit a pull request** with your improvements
- **Share your feedback** to help make this library better

Visit the repository: [https://github.com/ajaygummalla20/MFE](https://github.com/ajaygummalla20/MFE)

We appreciate all contributions from the community!

## License

MIT
