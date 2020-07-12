import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  courses: any;

  constructor(private data: DataService, private rest: RestApiService) {}

  async ngOnInit() {
    try {
      const data = await this.rest.get('http://localhost:3030/api/courses');
      data['success']
        ? (this.courses = data['courses'])
        : this.data.error('Could not fetch courses.');
    } catch (error) {
      this.data.error(error['message']);
    }
  }
}
