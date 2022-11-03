import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MachinesRoutingModule } from './machines-routing.module';
import { MachinesComponent } from './machines.component';
import { SharedModule } from '../../shared/shared.module';
import { SidebarModule } from '../../components/sidebar/sidebar.module';
import { AddMachineComponent } from './add-machine/add-machine.component';
import { EditMachineComponent } from './edit-machine/edit-machine.component';
import { TableMachinesComponent } from './table-machines/table-machines.component';


@NgModule({
  declarations: [
    MachinesComponent,
    AddMachineComponent,
    EditMachineComponent,
    TableMachinesComponent
  ],
  imports: [
    CommonModule,
    MachinesRoutingModule,
    SharedModule,
    SidebarModule
  ],
  exports: [
    MachinesComponent
  ]
})
export class MachinesModule { }
