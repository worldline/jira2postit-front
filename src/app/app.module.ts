import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppComponent } from './components/app/app.component'
import { LoginComponent } from './components/login/login.component'
import { SprintsComponent } from './components/sprints/sprints.component'
import { AppRoutingModule } from './routing/app-routing.module'
import { FormattedTicketsComponent } from './components/formatted-tickets/formatted-tickets.component'
import { TicketKeyPipe } from './pipes/ticketkey.pipe'
import { ChunksPipe } from './pipes/chunks.pipe'
import { ConfigurationComponent } from './components/configuration/configuration.component'
import { LoaderComponent } from './components/shared/loader/loader.component'
import { OverlayLoaderComponent } from './components/shared/overlay-loader/overlay-loader.component'

import { OverlayLoaderInterceptor } from './services/loading-interceptor'
import { ErrorInterceptor } from './services/error-interceptor'
import { AboutComponent } from './components/about/about.component'
import { GetStartedComponent } from './components/get-started/get-started.component'
import { TemplatesComponent } from './components/templates/templates.component'
import { KanbanIssuesComponent } from './components/kanban-issues/kanban-issues.component'
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SprintsComponent,
    FormattedTicketsComponent,
    TicketKeyPipe,
    ChunksPipe,
    ConfigurationComponent,
    LoaderComponent,
    OverlayLoaderComponent,
    AboutComponent,
    GetStartedComponent,
    TemplatesComponent,
    KanbanIssuesComponent,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OverlayLoaderInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
