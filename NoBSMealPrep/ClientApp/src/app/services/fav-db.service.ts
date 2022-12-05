import { Inject, Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient} from '@angular/common/http';

import { FavoriteRecipe } from 'src/interfaces/FavoriteRecipe';

@Injectable({
  providedIn: 'root'
})
export class FavDbService {

  baseURL:string;
  controllerPath:string = "api/FavoriteRecipe/";

  constructor(private http:HttpClient, @Inject("BASE_URL") private url:string) {
    this.baseURL=url;
  }

  getFavoriteList(): Observable<FavoriteRecipe[]> { //list all objects in the db
    return this.http.get<FavoriteRecipe[]>(this.baseURL + this.controllerPath);
  }

  postFavoriteRecipe(newFavRecipe:FavoriteRecipe):Observable<any> { //create an object to add to db
    return this.http.post(this.baseURL + this.controllerPath, newFavRecipe);
  }

  deleteFavoriteRecipe(id:number): Observable<any> { //remove favorite object from db
    return this.http.delete(this.baseURL + this.controllerPath+ id);
  }

}
