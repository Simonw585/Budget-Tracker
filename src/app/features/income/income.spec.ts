import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeComponent } from './income';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('IncomeComponent', () => {
  let component: IncomeComponent;
  let fixture: ComponentFixture<IncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(IncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should reject blank income entries before submission', () => {
    component.newTransaction = {
      source: '',
      category: '',
      amount: 0,
      date: '',
      notes: ''
    };

    expect(component.validateForm()).toBeFalse();
    expect(component.formError).toContain('Source');
  });
});
