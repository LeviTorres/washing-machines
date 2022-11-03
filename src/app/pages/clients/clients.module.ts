import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { SharedModule } from '../../shared/shared.module';
import { SidebarModule } from 'src/app/components/sidebar/sidebar.module';
import { AddClientComponent } from './add-client/add-client.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { TableClientsComponent } from './table-clients/table-clients.component';


@NgModule({
  declarations: [
    ClientsComponent,
    AddClientComponent,
    EditClientComponent,
    TableClientsComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    SharedModule,
    SidebarModule
  ],
  exports: [
    ClientsComponent
  ]
})
export class ClientsModule { }
