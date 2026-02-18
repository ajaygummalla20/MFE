import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MicroFrontendConfig, LoadedMicroFrontend } from '../models/micro-frontend.models';

@Injectable({
    providedIn: 'root'
})
export class ExternalAppLoaderService {
    private loadedScripts = new Map<string, Promise<LoadedMicroFrontend>>();
    private loadedStyles = new Set<string>();
    private loadingStatus = new BehaviorSubject<{ [key: string]: 'loading' | 'loaded' | 'error' }>({});

    constructor() { }

    /**
     * Load external micro-frontend application script
     */
    loadExternalApp(config: MicroFrontendConfig): Promise<LoadedMicroFrontend> {
        const { appName, scriptUrl } = config;

        if (this.loadedScripts.has(appName)) {
            return this.loadedScripts.get(appName)!;
        }

        const loadPromise = this.loadScript(scriptUrl, appName)
            .then(() => {
                this.updateLoadingStatus(appName, 'loaded');
                return this.getAppFromWindow(appName);
            })
            .catch(error => {
                this.updateLoadingStatus(appName, 'error');
                console.error(`[MicroFrontend] Failed to load: ${appName}`, error);
                throw error;
            });

        this.loadedScripts.set(appName, loadPromise);
        this.updateLoadingStatus(appName, 'loading');

        return loadPromise;
    }

    /**
     * Load external CSS stylesheet
     */
    loadExternalStyles(cssUrl: string): Promise<void> {
        if (this.loadedStyles.has(cssUrl)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssUrl;
            link.onload = () => {
                this.loadedStyles.add(cssUrl);
                resolve();
            };
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    /**
     * Get observable of loading status
     */
    getLoadingStatus(): Observable<{ [key: string]: 'loading' | 'loaded' | 'error' }> {
        return this.loadingStatus.asObservable();
    }

    /**
     * Check if app is loaded
     */
    isAppLoaded(appName: string): boolean {
        return this.loadingStatus.value[appName] === 'loaded';
    }

    /**
     * Preload multiple apps
     */
    preloadApps(configs: MicroFrontendConfig[]): Promise<LoadedMicroFrontend[]> {
        return Promise.all(configs.map(config => this.loadExternalApp(config)));
    }

    /**
     * Clear loaded app from cache (useful for development/hot reload)
     */
    clearApp(appName: string): void {
        this.loadedScripts.delete(appName);
        const currentStatus = { ...this.loadingStatus.value };
        delete currentStatus[appName];
        this.loadingStatus.next(currentStatus);
    }

    private loadScript(url: string, appName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const existingScript = document.querySelector(`script[data-mf-app="${appName}"]`);
            if (existingScript) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.type = 'text/javascript';
            script.async = true;
            script.setAttribute('data-mf-app', appName);

            script.onload = () => {
                console.log(`[MicroFrontend] Loaded: ${appName}`);
                resolve();
            };

            script.onerror = (error) => {
                console.error(`[MicroFrontend] Failed to load script: ${url}`, error);
                reject(new Error(`Failed to load script: ${url}`));
            };

            document.body.appendChild(script);
        });
    }

    private getAppFromWindow(appName: string): LoadedMicroFrontend {
        const app = (window as any)[appName];

        if (!app) {
            throw new Error(`App "${appName}" not found on window object. Ensure the app exposes: window.${appName}`);
        }

        if (!app.mount || typeof app.mount !== 'function') {
            throw new Error(`App "${appName}" must expose a mount() function`);
        }

        return app;
    }

    private updateLoadingStatus(appName: string, status: 'loading' | 'loaded' | 'error'): void {
        this.loadingStatus.next({
            ...this.loadingStatus.value,
            [appName]: status
        });
    }
}
