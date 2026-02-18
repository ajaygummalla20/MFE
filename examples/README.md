# Usage Examples

This directory contains example implementations for using the micro-frontend packages.

## Examples

1. **React Example** - Sales Dashboard
2. **Vue Example** - Inventory Management
3. **Angular Host** - Main Application

## Quick Start

### 1. React App (External)

```bash
# Create React app
npx create-react-app sales-dashboard
cd sales-dashboard

# Install client package
npm install @mfe/micro-frontend-client
```

**src/index.js:**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createReactMicroFrontend } from '@mfe/micro-frontend-client/react';
import App from './App';

createReactMicroFrontend({
  name: 'salesDashboard',
  rootComponent: App,
  React,
  ReactDOM
});

// For standalone development
if (!window.location.pathname.includes('host')) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App config={{ title: 'Sales Dashboard' }} />);
}
```

**src/App.js:**
```javascript
function App({ config, onNavigate }) {
  return (
    <div>
      <h1>{config?.title || 'Sales Dashboard'}</h1>
      <button onClick={() => onNavigate?.('/home')}>
        Back to Home
      </button>
      {/* Your app content */}
    </div>
  );
}

export default App;
```

### 2. Vue App (External)

```bash
# Create Vue app
npm create vue@latest inventory-app
cd inventory-app

# Install client package
npm install @mfe/micro-frontend-client
```

**src/main.js:**
```javascript
import { createApp } from 'vue';
import { createVueMicroFrontend } from '@mfe/micro-frontend-client/vue';
import App from './App.vue';

createVueMicroFrontend({
  name: 'inventoryApp',
  createApp,
  rootComponent: App
});

// For standalone development
if (!window.location.pathname.includes('host')) {
  createApp(App).mount('#app');
}
```

**src/App.vue:**
```vue
<template>
  <div>
    <h1>{{ config.title || 'Inventory Management' }}</h1>
    <button @click="goHome">Back to Home</button>
    <!-- Your app content -->
  </div>
</template>

<script setup>
import { inject } from 'vue';

const config = inject('externalProps', {});
const onNavigate = inject('onNavigate', () => {});

const goHome = () => onNavigate('/home');
</script>
```

### 3. Angular Host (Main App)

```bash
# Create Angular app
ng new host-app
cd host-app

# Install host package
npm install @mfe/micro-frontend-host
```

#### Option A: NgModule-based (Traditional)

**app.module.ts:**
```typescript
import { MicroFrontendHostModule } from '@mfe/micro-frontend-host';

@NgModule({
  imports: [
    // ... other imports
    MicroFrontendHostModule
  ]
})
export class AppModule { }
```

**app-routing.module.ts:**
```typescript
import { DynamicAppLoaderComponent } from '@mfe/micro-frontend-host';

const routes: Routes = [
  {
    path: 'sales',
    component: DynamicAppLoaderComponent,
    data: {
      appName: 'salesDashboard',
      scriptUrl: 'http://localhost:4601/static/js/main.js',
      props: { title: 'Sales Dashboard' }
    }
  },
  {
    path: 'inventory',
    component: DynamicAppLoaderComponent,
    data: {
      appName: 'inventoryApp',
      scriptUrl: 'http://localhost:4602/js/app.js',
      props: { title: 'Inventory' }
    }
  }
];
```

#### Option B: Standalone App (Angular 14+)

**main.ts:**
```typescript
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
          scriptUrl: 'http://localhost:4601/static/js/main.js',
          props: { title: 'Sales Dashboard' }
        }
      },
      {
        path: 'inventory',
        component: DynamicAppLoaderComponent,
        data: {
          appName: 'inventoryApp',
          scriptUrl: 'http://localhost:4602/js/app.js',
          props: { title: 'Inventory' }
        }
      }
    ])
  ]
});
```

## Build Configuration

### React (Webpack)

Create **craco.config.js:**
```javascript
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output = {
        ...webpackConfig.output,
        library: 'salesDashboard',
        libraryTarget: 'window'
      };
      return webpackConfig;
    }
  },
  devServer: {
    port: 4601,
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
};
```

### Vue (vite.config.js)

```javascript
export default {
  build: {
    lib: {
      entry: './src/main.js',
      name: 'inventoryApp',
      formats: ['umd']
    }
  },
  server: {
    port: 4602,
    cors: true
  }
};
```

## Running the Examples

1. Start external apps:
```bash
# Terminal 1 - React app
cd sales-dashboard
npm start  # Port 4601

# Terminal 2 - Vue app
cd inventory-app
npm run dev  # Port 4602
```

2. Start host app:
```bash
# Terminal 3 - Angular host
cd host-app
ng serve  # Port 4200
```

3. Navigate to:
- `http://localhost:4200/sales` - React app
- `http://localhost:4200/inventory` - Vue app

## Notes

- External apps must expose themselves on `window` object
- CORS must be enabled in development
- Production builds should be served from CDN or same domain
