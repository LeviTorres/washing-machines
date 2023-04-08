import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DryersComponent } from './dryers.component';

const routes: Routes = [
  {
    path: '', component: DryersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DryersRoutingModule { }
