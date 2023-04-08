import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDryerComponent } from './edit-dryer.component';

describe('EditDryerComponent', () => {
  let component: EditDryerComponent;
  let fixture: ComponentFixture<EditDryerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDryerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDryerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
