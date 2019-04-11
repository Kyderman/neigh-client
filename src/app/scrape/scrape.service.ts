import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class ScrapeService {

  constructor(
    private http: HttpClient
  ) { }

  public getRequestCount(date: Date) {
    return this.http.get(`${environment.API_URL}scrape/getRequestCount?scrapeDate=${date.toLocaleDateString('en-US')}`).pipe(
      map(a => {
        return a['data']['requests'];
      })
    );
  }

  public getScrapeData(date: Date, batch: number, count: number = 10): Observable<any> {
    return this.http.get(`${environment.API_URL}scrape?scrapeDate=${date.toLocaleDateString('en-US')}&batch=${batch}&count=${count}`).pipe(
      map(a => {
        return a['data'];
      })
    );;
  }
}
