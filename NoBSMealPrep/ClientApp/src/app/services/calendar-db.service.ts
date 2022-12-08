import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Calendar } from 'src/interfaces/Calendar';

@Injectable({
  providedIn: 'root'
})
export class CalendarDbService {

  baseURL: string;

  controllerPath:string = "api/Calendar/";

  constructor(private http : HttpClient, @Inject("BASE_URL") private url : string) { 
    this.baseURL = url;
  }

  getCalendarItems(): Observable <Calendar[]> { //list all objects in the db
    return this.http.get<Calendar[]>(this.baseURL + this.controllerPath);
  }

  postCalendarItem(newCalItem: Calendar):Observable<any> { //create an object to add to db
    return this.http.post(this.baseURL + this.controllerPath, newCalItem);
  }

  updateCalendarItem(id:number, newCalItem: Calendar): Observable<any>{ //updates a calendar item in the list by index, and by passing it a new value
    return this.http.put(this.baseURL + this.controllerPath + `${id}`, newCalItem);
  }

  deleteCalendarItem(id:number): Observable<any> { //remove calendar item from db
    return this.http.delete(this.baseURL + this.controllerPath+ id);
  }

}
