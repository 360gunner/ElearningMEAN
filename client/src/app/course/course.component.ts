import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  myReview = {
    title: '',
    description: '',
    rating: 0,
  };
  btnDisabled = false;

  course: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.rest
        .get(`http://localhost:3030/api/course/${res['id']}`)
        .then(data => {
          data['success']
            ? (this.course = data['course'])
            : this.router.navigate(['/']);
        })
        .catch(error => this.data.error(error['message']));
    });
  }

  addToCart() {
    this.data.addToCart(this.course)
      ? this.data.success('Course successfully added to cart.')
      : this.data.error('Course has already been added to cart.');
  }

  async postReview() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.post('http://localhost:3030/api/review', {
        courseId: this.course._id,
        title: this.myReview.title,
        description: this.myReview.description,
        rating: this.myReview.rating,
      });
      data['success']
        ? this.data.success(data['message'])
        : this.data.error(data['message']);
      this.btnDisabled = false;
    } catch (error) {
      this.data.error(error['message']);
    }
  }
}
