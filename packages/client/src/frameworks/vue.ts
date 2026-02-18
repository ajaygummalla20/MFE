/**
 * Vue-specific helpers for micro-frontends
 * 
 * NOTE: Import this from '@ajay_gummalla/micro-frontend-client/vue'
 * Vue must be installed in your project
 */

import type { MicroFrontendMountProps } from '../core/types';
import { registerMicroFrontend } from '../core/lifecycle';

/**
 * Create Vue micro-frontend integration
 * 
 * @example
 * ```typescript
 * import { createApp } from 'vue';
 * import { createVueMicroFrontend } from '@ajay_gummalla/micro-frontend-client/vue';
 * import App from './App.vue';
 * 
 * createVueMicroFrontend({
 *   name: 'myVueApp',
 *   createApp,
 *   rootComponent: App
 * });
 * ```
 */
export function createVueMicroFrontend(config: {
    name: string;
    createApp: any;
    rootComponent: any;
    router?: any;
    store?: any;
}) {
    const { createApp } = config;

    registerMicroFrontend({
        name: config.name,

        mount: (props: MicroFrontendMountProps) => {
            const { container, routeData, onNavigate } = props;

            const app = createApp(config.rootComponent, {
                externalProps: routeData,
                onNavigate: onNavigate
            });

            // Provide props to all components
            app.provide('externalProps', routeData);
            app.provide('onNavigate', onNavigate);

            // Use router and store if provided
            if (config.router) {
                app.use(config.router);
            }

            if (config.store) {
                app.use(config.store);
            }

            app.mount(container);

            return { app };
        },

        unmount: ({ app }: any) => {
            if (app && app.unmount) {
                app.unmount();
            }
        }
    });
}

/**
 * Vue composable for accessing micro-frontend props
 */
export function useMicroFrontendProps() {
    // This would use Vue's inject in a real implementation
    return {
        config: {},
        onNavigate: (path: string) => console.log('Navigate:', path)
    };
}
