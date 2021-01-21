import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  Object = Object;
  public months = {};
  public avgListening = {};
  public makeDistribution = {};
  public mostContacted = 0;

  private fileToUpload: any;

  constructor() {}

  async getTestReports() {
    const resp = ((await (
      await fetch('http://localhost:8080/test')
    ).json()) as any).data;
    console.log(resp);
    this.avgListening = resp.avgListening;
    this.makeDistribution = resp.makeDistribution;
    this.mostContacted = resp.mostContacted;
    this.months = resp.months;
  }
}
