/**
 * React-specific helpers for micro-frontends
 * 
 * NOTE: Import this from '@mfe/micro-frontend-client/react'
 * React and ReactDOM must be installed in your project
 */

import type { MicroFrontendMountProps } from '../core/types';
import { registerMicroFrontend } from '../core/lifecycle';

/**
 * Create React micro-frontend integration
 * 
 * @example
 * ```typescript
 * import React from 'react';
 * import ReactDOM from 'react-dom/client';
 * import { createReactMicroFrontend } from '@mfe/micro-frontend-client/react';
 * import App from './App';
 * 
 * createReactMicroFrontend({
 *   name: 'myReactApp',
 *   rootComponent: App,
 *   React,
 *   ReactDOM
 * });
 * ```
 */
export function createReactMicroFrontend(config: {
    name: string;
    rootComponent: any;
    React: any;
    ReactDOM: any;
    wrapperComponent?: any;
}) {
    const { React, ReactDOM } = config;

    registerMicroFrontend({
        name: config.name,

        mount: (props: MicroFrontendMountProps) => {
            const { container, routeData, onNavigate } = props;

            const root = ReactDOM.createRoot(container);
            const Component = config.rootComponent;

            const AppWrapper = config.wrapperComponent || React.Fragment;

            root.render(
                React.createElement(AppWrapper, null,
                    React.createElement(Component, {
                        config: routeData,
                        onNavigate: onNavigate,
                        ...routeData
                    })
                )
            );

            return { root };
        },

        unmount: ({ root }: any) => {
            if (root && root.unmount) {
                root.unmount();
            }
        }
    });
}

/**
 * React Hook for accessing micro-frontend props
 */
export function useMicroFrontendProps() {
    // This would typically use context in a real implementation
    return {
        config: {},
        onNavigate: (path: string) => console.log('Navigate:', path)
    };
}
