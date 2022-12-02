import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { User } from 'src/interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UserDbService {

  baseURL:string;
  controllerPath:string = "api/User/";

  constructor(private http:HttpClient, @Inject("BASE_URL") private url:string) {
    this.baseURL=url;
  }

  getUsers(): Observable<User[]> { //list all users in the db
    return this.http.get<User[]>(this.baseURL + this.controllerPath);
  }

  getOneUser(logininfo:string): Observable<User> { //getting one user from the db
    return this.http.get<User>(this.baseURL + this.controllerPath + logininfo);
  }

  postUser(newUser:User):Observable<any> { //create a user to add to db
    return this.http.post(this.baseURL + this.controllerPath, newUser);
  }

  deleteUser(id:number): Observable<any> { //remove user object from db
    return this.http.delete(this.baseURL + this.controllerPath+ id);
  }

}
