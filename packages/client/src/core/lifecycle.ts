import { MicroFrontendApp, MicroFrontendConfig } from './types';

/**
 * Register a micro-frontend application on the window object
 * 
 * @param config Micro-frontend configuration
 * 
 * @example
 * ```typescript
 * registerMicroFrontend({
 *   name: 'myApp',
 *   mount: (props) => { ... },
 *   unmount: (instance) => { ... }
 * });
 * ```
 */
export function registerMicroFrontend(config: MicroFrontendConfig): void {
    const app: MicroFrontendApp = {
        bootstrap: config.bootstrap,
        mount: config.mount,
        unmount: config.unmount,
        update: config.update
    };

    (window as any)[config.name] = app;

    console.log(`[MicroFrontend] Registered: ${config.name}`);
}

/**
 * Create a lifecycle adapter for easier integration
 */
export function createLifecycleAdapter(config: {
    mount: (container: HTMLElement, props: any) => any;
    unmount: (instance: any) => void;
    update?: (instance: any, props: any) => void;
}) {
    return {
        mount: (props: any) => {
            return config.mount(props.container, props.routeData || {});
        },
        unmount: (instance: any) => {
            config.unmount(instance);
        },
        update: config.update ? (instance: any, props: any) => {
            config.update!(instance, props.routeData || {});
        } : undefined
    };
}
