import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environments'; 

const baseURL = environment.serverUrl+'/reportes';

@Injectable({
  providedIn: 'root'
})

export class reportesService {
  constructor(private oauthService: OAuthService, private httpClient: HttpClient) { }
  
  
  getReports():Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/get-report/`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  executeSavedReport(reportId: number, fromDate: string, toDate: string):Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.post(`${baseURL}/execute-saved-report`,{ reportId, fromDate, toDate }, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  createreportes(newData:[]):Observable<any> {
    return this.httpClient.post(`${baseURL}/save-report`,newData, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  updatereportes(newData:any):Observable<any> {
    //console.log(newData)
    return this.httpClient.put(`${baseURL}/update-report/${newData.id}`,newData, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  deletereportes(id:string):Observable<any> {
    //console.log(newData)
    return this.httpClient.delete(`${baseURL}/delete-report/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
