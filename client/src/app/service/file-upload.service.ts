import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
 

  constructor(private http: HttpClient) { }

  upload(file: File, title: string, description: string, userId: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('user_id', userId);
    const req = new HttpRequest('POST', `${environment.apiBaseUrl}/photo`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/photo`);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/photo/${id}`);
  }
}




