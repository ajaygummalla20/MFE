import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    AfterViewInit,
    Renderer2,
    ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExternalAppLoaderService } from '../services/external-app-loader.service';
import { LoadedMicroFrontend } from '../models/micro-frontend.models';

@Component({
    selector: 'mf-dynamic-app-loader',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="mf-dynamic-app-wrapper">
      <div *ngIf="loading" class="mf-loading-container">
        <div class="mf-spinner"></div>
        <p>Loading {{ appName }}...</p>
      </div>
      <div *ngIf="error" class="mf-error-container">
        <p class="mf-error-message">Failed to load application: {{ appName }}</p>
        <p class="mf-error-details" *ngIf="errorMessage">{{ errorMessage }}</p>
        <button (click)="retry()" class="mf-retry-button">Retry</button>
      </div>
      <div 
        #appContainer 
        class="mf-app-container"
        [class.mf-hidden]="loading || error">
      </div>
    </div>
  `,
    styles: [`
    .mf-dynamic-app-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .mf-app-container {
      width: 100%;
      height: 100%;
      overflow: auto;
    }

    .mf-app-container.mf-hidden {
      display: none;
    }

    .mf-loading-container,
    .mf-error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 400px;
      padding: 20px;
    }

    .mf-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: mf-spin 1s linear infinite;
    }

    @keyframes mf-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .mf-error-container {
      color: #d32f2f;
    }

    .mf-error-message {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .mf-error-details {
      font-size: 14px;
      color: #666;
      margin-bottom: 16px;
    }

    .mf-retry-button {
      padding: 10px 24px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    .mf-retry-button:hover {
      background-color: #2980b9;
    }
  `]
})
export class DynamicAppLoaderComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('appContainer', { read: ElementRef, static: false })
    appContainer!: ElementRef;

    appName: string = '';
    loading: boolean = true;
    error: boolean = false;
    errorMessage: string = '';

    private mountedApp: LoadedMicroFrontend | null = null;
    private appInstance: any = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private externalAppLoader: ExternalAppLoaderService,
        private renderer: Renderer2,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const routeData = this.route.snapshot.data;
        this.appName = routeData['appName'] || 'external-app';
    }

    async ngAfterViewInit() {
        await this.loadAndMountApp();
    }

    ngOnDestroy() {
        this.unmountApp();
    }

    async retry() {
        this.error = false;
        this.errorMessage = '';
        this.loading = true;
        this.cdr.detectChanges();
        await this.loadAndMountApp();
    }

    private async loadAndMountApp() {
        try {
            const routeData = this.route.snapshot.data;
            const appConfig = {
                appName: routeData['appName'],
                scriptUrl: routeData['scriptUrl'],
                moduleName: routeData['moduleName'],
                exposedModule: routeData['exposedModule'],
                cssUrl: routeData['cssUrl'],
                props: routeData['props']
            };

            // Load CSS if provided
            if (appConfig.cssUrl) {
                await this.externalAppLoader.loadExternalStyles(appConfig.cssUrl);
            }

            // Load the external app
            this.mountedApp = await this.externalAppLoader.loadExternalApp(appConfig);

            // Mount the app
            if (this.mountedApp.mount) {
                const mountProps = {
                    container: this.appContainer.nativeElement,
                    basePath: this.getBasePath(),
                    routeData: appConfig.props || {},
                    onNavigate: this.handleNavigation.bind(this),
                    parentRouter: this.router,
                    parentRoute: this.route
                };

                this.appInstance = await this.mountedApp.mount(mountProps);
                this.loading = false;
                this.cdr.detectChanges();
            } else {
                throw new Error('External app does not expose mount function');
            }
        } catch (err: any) {
            console.error('[MicroFrontend] Error loading external app:', err);
            this.loading = false;
            this.error = true;
            this.errorMessage = err.message || 'Unknown error occurred';
            this.cdr.detectChanges();
        }
    }

    private unmountApp() {
        if (this.mountedApp?.unmount && this.appInstance) {
            try {
                this.mountedApp.unmount(this.appInstance);
            } catch (err) {
                console.error('[MicroFrontend] Error unmounting app:', err);
            }
        }

        if (this.appContainer?.nativeElement) {
            while (this.appContainer.nativeElement.firstChild) {
                this.renderer.removeChild(
                    this.appContainer.nativeElement,
                    this.appContainer.nativeElement.firstChild
                );
            }
        }
    }

    private getBasePath(): string {
        const urlSegments = this.route.snapshot.url.map(segment => segment.path);
        return '/' + urlSegments.join('/');
    }

    private handleNavigation(path: string) {
        if (path.startsWith('http')) {
            window.location.href = path;
        } else {
            this.router.navigateByUrl(path);
        }
    }
}
