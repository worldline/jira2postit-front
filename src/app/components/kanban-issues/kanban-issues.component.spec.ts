import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { KanbanIssuesComponent } from './kanban-issues.component'

describe('KanbanIssuesComponent', () => {
  let component: KanbanIssuesComponent
  let fixture: ComponentFixture<KanbanIssuesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KanbanIssuesComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanIssuesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
