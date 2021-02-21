import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuardService } from './services/auth-guard.services'

import { NotFoundComponent } from './pages/not-found/not-found.component'
import { FullComponent } from './pages/full/full.component'

import { LoginComponent } from './pages/login/login.component'
import { HomeComponent } from './pages/home/home.component'
import { UserComponent } from './pages/user/user.component'

import { ListComponent as TransactionList } from './pages/transactions/list/list.component'
import { AddComponent as TransactionAdd } from './pages/transactions/add/add.component'
import { SignupComponent } from './pages/signup/signup.component'


const childrenFullComponent = [   
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',                     component: HomeComponent },
  { path: 'user',                     component: UserComponent},
  { path: 'transactions',             component: TransactionList },
  { path: 'transactions/create',      component: TransactionAdd },
  { path: 'transactions/edit/:id',    component: TransactionAdd },
]

const routes: Routes = [
  { path: 'not-found', component: NotFoundComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/:id', component: SignupComponent },
  {
    path: '', component: FullComponent,
    canActivate: [AuthGuardService],
    children: childrenFullComponent
  },
  { path: '**', redirectTo: '/not-found' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
