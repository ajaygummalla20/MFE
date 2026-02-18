import { Route } from '@angular/router';
import { DynamicAppLoaderComponent } from '../components/dynamic-app-loader.component';
import { MicroFrontendRouteConfig } from '../models/micro-frontend.models';

/**
 * Generate Angular routes for micro-frontends
 * 
 * @param configs Array of micro-frontend route configurations
 * @returns Array of Angular Route objects
 * 
 * @example
 * ```typescript
 * const microFrontendRoutes = generateMicroFrontendRoutes([
 *   {
 *     path: 'sales-dashboard',
 *     appName: 'salesDashboard',
 *     scriptUrl: 'http://localhost:4601/main.js',
 *     cssUrl: 'http://localhost:4601/styles.css',
 *     props: { title: 'Sales Dashboard' }
 *   }
 * ]);
 * ```
 */
export function generateMicroFrontendRoutes(configs: MicroFrontendRouteConfig[]): Route[] {
    return configs.map(config => ({
        path: config.path,
        component: DynamicAppLoaderComponent,
        canActivate: config.canActivate,
        data: {
            appName: config.appName,
            scriptUrl: config.scriptUrl,
            cssUrl: config.cssUrl,
            moduleName: config.moduleName,
            exposedModule: config.exposedModule,
            props: config.props,
            ...config.data
        }
    }));
}

/**
 * Generate a single route for a micro-frontend
 */
export function generateMicroFrontendRoute(config: MicroFrontendRouteConfig): Route {
    return generateMicroFrontendRoutes([config])[0];
}
