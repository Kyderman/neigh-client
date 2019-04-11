import { Component, OnInit, ViewChild } from '@angular/core';
import { ScrapeService } from './scrape/scrape.service';
import { forkJoin } from 'rxjs';
import { MatDatepicker } from '@angular/material';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import * as Bluebird from 'bluebird';
import { flatten } from '@angular/router/src/utils/collection';

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

      //apiRequests.push(this.scrapeService.getScrapeData(this.selectedDate, 1, 1))

      forkJoin(apiRequests).subscribe(async (r: any[]) => {
        let newData = await this.mergeForOutput(r.flat(1))
        var options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: false,
          useBom: true,
          noDownload: false,
          headers: ['Track', 'Time', 'Name', 'Distance', 'RaceRating', 'WinningTime', 'Horse', 'Position', 'Rating', 'YardsBehind', 'Price', 'Age', 'Weight'],
          nullToEmptyString: true,
        };
        new Angular5Csv(newData.flat(1), `Horse Results - ${this.selectedDate.toString()}`, options);
      }, (error) => {
        console.log(error)
      }, () => {
        this.showResults = false;
      })
    } else {
      this.showResults = false;
    }
  }

  public async mergeForOutput(data) {
    return await Bluebird.map(data, async (d) => {
      if (d.horses && d.horses.length === 0) { return };
      return await Bluebird.map(d.horses, async(horse) => {
        if(horse === null) { return };
        return {
          Track: d.course,
          Time: d.time,
          Name: d.name,
          Distance: d.distance,
          RaceRating: d.rating,
          WinningTime: d.winningTime,
          Horse: horse.horse,
          Position: horse.position,
          Rating: horse.rating,
          YardsBehind: horse.yardsBehind,
          Price: horse.price,
          Age: horse.age,
          Weight: `${horse.weightStone.toString()}s ${horse.weightLb.toString()}lb`
        }
      })
    });
  }
}
