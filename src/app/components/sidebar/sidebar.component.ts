import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() title: string;

  page: string;

  @Output() activeMenu = new EventEmitter();

  @Output() activeDrop = new EventEmitter();

  public isOpenMenu: boolean = false;

  public dropMenuActive: any;

  constructor(
    public _general: GeneralService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.title = '';
    this.page = window.location.pathname;
  }

  ngOnInit(): void {
  }

  public openDropMenu(element: any): void {
    if (this.dropMenuActive) {
      this.closeDropMenu();
    } else {
      this.dropMenuActive = element;
      this.activeDrop.emit(element);
    }
  }

  public closeDropMenu(): void {
    this.dropMenuActive = null;
    this.activeDrop.emit(null);
  }

  public closeMenu(): void {
    this.isOpenMenu = false;
    this.activeMenu.emit(false);
  }

  public openMenu(): void {
    this.isOpenMenu = true;
    this.activeMenu.emit(true);
  }


}
