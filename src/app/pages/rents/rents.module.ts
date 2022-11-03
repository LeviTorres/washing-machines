import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RentsRoutingModule } from './rents-routing.module';
import { RentsComponent } from './rents.component';
import { SharedModule } from '../../shared/shared.module';
import { SidebarModule } from '../../components/sidebar/sidebar.module';


@NgModule({
  declarations: [
    RentsComponent
  ],
  imports: [
    CommonModule,
    RentsRoutingModule,
    SharedModule,
    SidebarModule
  ],
  exports: [
    RentsComponent
  ]
})
export class RentsModule { }
