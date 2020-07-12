import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCourseComponent } from './post-course.component';

describe('PostCourseComponent', () => {
  let component: PostCourseComponent;
  let fixture: ComponentFixture<PostCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
