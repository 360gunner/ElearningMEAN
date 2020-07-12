import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-post-course',
  templateUrl: './post-course.component.html',
  styleUrls: ['./post-course.component.scss']
})
export class PostCourseComponent implements OnInit {

  course = {
    title: '',
    price: 0,
    categoryId: '',
    description: '',
    course_picture: null
  };

  categories: any;
  btnDisabled = false;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://localhost:3030/api/categories'
      );
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  validate(course) {
    if (course.title) {
      if (course.price) {
        if (course.categoryId) {
          if (course.description) {
            if (course.course_picture) {
              return true;
            } else {
              this.data.error('Please select course image.');
            }
          } else {
            this.data.error('Please enter description.');
          }
        } else {
          this.data.error('Please select category.');
        }
      } else {
        this.data.error('Please enter a price.');
      }
    } else {
      this.data.error('Please enter a title.');
    }
  }

  fileChange(event: any) {
    this.course.course_picture = event.target.files[0];
  }

  async post() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.course)) {
        const form = new FormData();
        for (const key in this.course) {
          if (this.course.hasOwnProperty(key)) {
            if (key === 'course_picture') {
              form.append(
                'course_picture',
                this.course.course_picture,
                this.course.course_picture.name
              );
            } else {
              form.append(key, this.course[key]);
            }
          }
        }
        const data = await this.rest.post(
          'http://localhost:3030/api/teacher/courses',
          form
        );
        data['success']
          ? this.router.navigate(['/profile/mycourses'])
            .then(() => this.data.success(data['message']))
            .catch(error => this.data.error(error))
          : this.data.error(data['message']);
      }
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
