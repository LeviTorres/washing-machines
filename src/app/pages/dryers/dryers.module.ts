import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DryersRoutingModule } from './dryers-routing.module';
import { DryersComponent } from './dryers.component';
import { AddDryerComponent } from './add-dryer/add-dryer.component';
import { EditDryerComponent } from './edit-dryer/edit-dryer.component';
import { TableDryersComponent } from './table-dryers/table-dryers.component';
import { SidebarModule } from 'src/app/components/sidebar/sidebar.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DryersComponent,
    AddDryerComponent,
    EditDryerComponent,
    TableDryersComponent
  ],
  imports: [
    CommonModule,
    DryersRoutingModule,
    SharedModule,
    SidebarModule
  ]
})
export class DryersModule { }
