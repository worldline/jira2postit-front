import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FormattedTicketsComponent } from './formatted-tickets.component'

describe('FormattedTicketsComponent', () => {
  let component: FormattedTicketsComponent
  let fixture: ComponentFixture<FormattedTicketsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormattedTicketsComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormattedTicketsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
