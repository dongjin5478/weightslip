import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http:HttpClient) { }
  
  public generatePdf(user : any)
  {
      return this.http.post(`${baseUrl}weightslip`,user);
  }

  public startApi()
  {
    return this.http.get(`${baseUrl}`);
  }

  public refresh(): void {
    window.location.reload();
  }
}
