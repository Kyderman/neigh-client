import { Component, OnInit, ViewChild } from '@angular/core';
import { ScrapeService } from './scrape/scrape.service';
import { forkJoin } from 'rxjs';
import { MatDatepicker } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('picker') datePicker: MatDatepicker<Date>;

  public showResults: boolean = false;

  public selectedDate: Date = new Date();

  constructor(
    public scrapeService: ScrapeService
  ) {}

  public async ngOnInit() {

  }

  public async makeRequest() {
    this.showResults = true;

    let requestCount = await this.scrapeService.getRequestCount(this.selectedDate).toPromise();
    if(requestCount > 0) {
      let batchCount = Math.floor((requestCount / 10));
      let apiRequests = [];
      for(let i = 1; i <= batchCount; i++) {
        apiRequests.push(this.scrapeService.getScrapeData(this.selectedDate, i, 10))
      }

      forkJoin(apiRequests).subscribe((r) => {
        console.log(r)
      }, (error) => {
        console.log(error)
      }, () => {
        this.showResults = false;
      })
    } else {
      this.showResults = false;
    }
  }
}
