# @mfe/micro-frontend-client

[![npm version](https://img.shields.io/npm/v/@mfe/micro-frontend-client.svg)](https://www.npmjs.com/package/@mfe/micro-frontend-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Helper utilities for building micro-frontend client applications that integrate with [@mfe/micro-frontend-host](https://www.npmjs.com/package/@mfe/micro-frontend-host).

## Installation

```bash
npm install @mfe/micro-frontend-client
# or
pnpm add @mfe/micro-frontend-client
# or
yarn add @mfe/micro-frontend-client
```

## Quick Start

### React

```typescript
import React from 'react';
import { createReactMicroFrontend } from '@mfe/micro-frontend-client';
import App from './App';

createReactMicroFrontend({
  name: 'myReactApp',
  rootComponent: App
});

// Your App component receives props
function App({ config, onNavigate }) {
  return (
    <div>
      <h1>{config.title}</h1>
      <button onClick={() => onNavigate('/home')}>
        Go Home
      </button>
    </div>
  );
}
```

### Vue

```typescript
import { createApp } from 'vue';
import { createVueMicroFrontend } from '@mfe/micro-frontend-client';
import App from './App.vue';
import router from './router';
import store from './store';

createVueMicroFrontend({
  name: 'myVueApp',
  rootComponent: App,
  router,
  store
});
```

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>{{ config.title }}</h1>
    <button @click="goHome">Go Home</button>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const config = inject('externalProps');
const onNavigate = inject('onNavigate');

const goHome = () => onNavigate('/home');
</script>
```

### Vanilla JavaScript

```typescript
import { createVanillaMicroFrontend } from '@mfe/micro-frontend-client';

createVanillaMicroFrontend({
  name: 'myVanillaApp',
  mount: (container, props) => {
    container.innerHTML = `
      <div>
        <h1>${props.title}</h1>
        <button id="home-btn">Go Home</button>
      </div>
    `;
    
    const btn = container.querySelector('#home-btn');
    btn.addEventListener('click', () => props.onNavigate('/home'));
    
    return { container };
  },
  unmount: ({ container }) => {
    container.innerHTML = '';
  }
});
```

### Simple DOM App

```typescript
import { createDOMApp } from '@mfe/micro-frontend-client';

createDOMApp({
  name: 'myDOMApp',
  render: (container, props) => {
    container.innerHTML = `<h1>${props.title}</h1>`;
  }
});
```

## Manual Registration

```typescript
import { registerMicroFrontend } from '@mfe/micro-frontend-client';

registerMicroFrontend({
  name: 'myCustomApp',
  
  mount: (props) => {
    // Custom mount logic  
    const app = initializeMyApp(props.container);
    return app;
  },
  
  unmount: (app) => {
    // Cleanup
    app.destroy();
  }
});
```

## TypeScript Support

```typescript
import { 
  MicroFrontendMountProps,
  MicroFrontendApp,
  MicroFrontendConfig
} from '@mfe/micro-frontend-client';

const app: MicroFrontendApp = {
  mount: (props: MicroFrontendMountProps) => {
    // Your implementation
  },
  unmount: (instance) => {
    // Cleanup
  }
};
```

## Props Interface

Your app receives:

```typescript
interface MicroFrontendMountProps {
  container: HTMLElement;        // Render target
  basePath: string;              // Current route path
  routeData?: any;               // Props from host
  onNavigate?: (path) => void;   // Navigation function
  parentRouter?: any;            // Host router reference
  parentRoute?: any;             // Host route reference
}
```

## Webpack Configuration

Your app must expose itself on `window`:

```javascript
// webpack.config.js
module.exports = {
  output: {
    filename: 'main.js',
    library: 'myAppName',
    libraryTarget: 'window'
  }
};
```

## Complete Example

See our [examples repository](https://github.com/mfe/micro-frontend-examples) for complete working examples.

## API Reference

### Functions

- `createReactMicroFrontend(config)` - React integration
- `createVueMicroFrontend(config)` - Vue integration
- `createVanillaMicroFrontend(config)` - Vanilla JS integration
- `createDOMApp(config)` - Simple DOM-based app
- `registerMicroFrontend(config)` - Manual registration
- `createLifecycleAdapter(config)` - Custom lifecycle adapter

## License

MIT
