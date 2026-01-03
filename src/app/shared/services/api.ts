import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {

  apiUrl = environment.apiUrl;

  constructor(private http:HttpClient) {

  }

  getCategories() {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getBooks(queryParams:any) {
    return this.http.get(`${this.apiUrl}/books`, { params: queryParams});
  }

}
