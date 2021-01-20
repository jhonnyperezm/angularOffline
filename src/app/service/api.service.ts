import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  private URL_BACKEND = 'https://sprint-boot-offline.herokuapp.com/v1/';

  constructor(private http: HttpClient) {
  }

  getListar() {
    return this.http.get(`${this.URL_BACKEND}lista`);
  }

  postGuardarResgistro(json) {
    return this.http.post(`${this.URL_BACKEND}nuevo`,json);
  }


}
