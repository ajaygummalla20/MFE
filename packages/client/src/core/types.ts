/**
 * Core types for micro-frontend applications
 */

export interface MicroFrontendMountProps {
    /** DOM container element to render into */
    container: HTMLElement;

    /** Current route base path */
    basePath: string;

    /** Custom route data/props passed from host */
    routeData?: Record<string, any>;

    /** Navigation callback for routing */
    onNavigate?: (path: string) => void;

    /** Reference to parent router (framework-specific) */
    parentRouter?: any;

    /** Reference to parent route (framework-specific) */
    parentRoute?: any;
}

export interface MicroFrontendApp {
    /** Bootstrap function called before mount (optional) */
    bootstrap?: (props: MicroFrontendMountProps) => Promise<void> | void;

    /** Mount function - renders the app */
    mount: (props: MicroFrontendMountProps) => any;

    /** Unmount function - cleans up the app */
    unmount: (instance: any) => void;

    /** Optional update function for prop changes */
    update?: (instance: any, props: MicroFrontendMountProps) => void;
}

export interface MicroFrontendConfig {
    /** Unique app name */
    name: string;

    /** Mount function */
    mount: (props: MicroFrontendMountProps) => any;

    /** Unmount function */
    unmount: (instance: any) => void;

    /** Optional bootstrap */
    bootstrap?: (props: MicroFrontendMountProps) => Promise<void> | void;

    /** Optional update */
    update?: (instance: any, props: MicroFrontendMountProps) => void;
}
