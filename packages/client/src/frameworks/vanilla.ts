/**
 * Vanilla JavaScript helpers for micro-frontends
 */

import { MicroFrontendMountProps } from '../core/types';
import { registerMicroFrontend } from '../core/lifecycle';

/**
 * Create vanilla JS micro-frontend integration
 * 
 * @example
 * ```typescript
 * import { createVanillaMicroFrontend } from '@mfe/micro-frontend-client';
 * 
 * createVanillaMicroFrontend({
 *   name: 'myVanillaApp',
 *   mount: (container, props) => {
 *     container.innerHTML = '<h1>Hello World</h1>';
 *     return { container };
 *   },
 *   unmount: ({ container }) => {
 *     container.innerHTML = '';
 *   }
 * });
 * ```
 */
export function createVanillaMicroFrontend(config: {
    name: string;
    mount: (container: HTMLElement, props: any) => any;
    unmount: (instance: any) => void;
    bootstrap?: () => Promise<void> | void;
    update?: (instance: any, props: any) => void;
}) {
    registerMicroFrontend({
        name: config.name,

        bootstrap: config.bootstrap,

        mount: (props: MicroFrontendMountProps) => {
            const { container, routeData, onNavigate } = props;
            return config.mount(container, { ...routeData, onNavigate });
        },

        unmount: (instance: any) => {
            config.unmount(instance);
        },

        update: config.update ? (instance: any, props: MicroFrontendMountProps) => {
            config.update!(instance, { ...props.routeData, onNavigate: props.onNavigate });
        } : undefined
    });
}

/**
 * Simple helper to create a DOM-based app
 */
export function createDOMApp(config: {
    name: string;
    render: (container: HTMLElement, props: any) => void;
    cleanup?: (container: HTMLElement) => void;
}) {
    return createVanillaMicroFrontend({
        name: config.name,
        mount: (container, props) => {
            config.render(container, props);
            return { container };
        },
        unmount: ({ container }) => {
            if (config.cleanup) {
                config.cleanup(container);
            } else {
                container.innerHTML = '';
            }
        }
    });
}
