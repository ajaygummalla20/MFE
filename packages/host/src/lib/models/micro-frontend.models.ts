/**
 * Configuration interface for external micro-frontend applications
 */
export interface MicroFrontendConfig {
    /** Unique name for the app (will be exposed on window object) */
    appName: string;

    /** URL to the main JavaScript bundle */
    scriptUrl: string;

    /** Optional URL to the CSS bundle */
    cssUrl?: string;

    /** Optional module name for module federation */
    moduleName?: string;

    /** Optional exposed module for module federation */
    exposedModule?: string;

    /** Custom props to pass to the micro-frontend */
    props?: Record<string, any>;
}

/**
 * Loaded micro-frontend app lifecycle interface
 */
export interface LoadedMicroFrontend {
    /** Bootstrap function called before mount (optional) */
    bootstrap?: (props: MicroFrontendMountProps) => any;

    /** Mount function called when app should be rendered */
    mount: (props: MicroFrontendMountProps) => any;

    /** Unmount function called when app should be removed */
    unmount: (instance: any) => void;

    /** Optional update function for updating props without remounting */
    update?: (instance: any, props: MicroFrontendMountProps) => void;
}

/**
 * Props passed to micro-frontend mount function
 */
export interface MicroFrontendMountProps {
    /** DOM container element to render into */
    container: HTMLElement;

    /** Current route base path */
    basePath: string;

    /** Custom route data/props */
    routeData?: Record<string, any>;

    /** Navigation callback for routing */
    onNavigate?: (path: string) => void;

    /** Reference to parent Angular router */
    parentRouter?: any;

    /** Reference to parent Angular route */
    parentRoute?: any;
}

/**
 * Route configuration for micro-frontend
 */
export interface MicroFrontendRouteConfig extends MicroFrontendConfig {
    /** Route path (without leading slash) */
    path: string;

    /** Optional route guards */
    canActivate?: any[];

    /** Optional route data */
    data?: Record<string, any>;
}
