import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from '../components/login/login.component'
import { SprintsComponent } from '../components/sprints/sprints.component'
import { FormattedTicketsComponent } from '../components/formatted-tickets/formatted-tickets.component'
import { ConfigurationComponent } from '../components/configuration/configuration.component'
import { GetStartedComponent } from '../components/get-started/get-started.component'
import { TemplatesComponent } from '../components/templates/templates.component'
import { AboutComponent } from '../components/about/about.component'
import { AuthGuard } from './auth-guard/auth.guard'
import { KanbanIssuesComponent } from '../components/kanban-issues/kanban-issues.component'

const routes: Routes = [
  { path: '', redirectTo: '/get-started', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'boards/:boardId/sprints', component: SprintsComponent, canActivate: [AuthGuard] },
  { path: 'boards/:boardId/issues', component: KanbanIssuesComponent, canActivate: [AuthGuard]},
  { path: 'boards/:boardId/configuration', component: ConfigurationComponent, canActivate: [AuthGuard] },
  { path: 'boards/:boardId/formattedTickets', component: FormattedTicketsComponent, canActivate: [AuthGuard] },
  { path: 'get-started', component: GetStartedComponent},
  { path: 'templates', component: TemplatesComponent},
  { path: 'about', component: AboutComponent},
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
