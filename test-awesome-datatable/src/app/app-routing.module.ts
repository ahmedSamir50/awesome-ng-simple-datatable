import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestAwesomeDTComponent } from './components/test-awesome-dt/test-awesome-dt.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: TestAwesomeDTComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
