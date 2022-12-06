import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroceryList } from 'src/interfaces/GroceryList';

@Injectable({
  providedIn: 'root'
})
export class GroceryDbService {

  baseURL: string;
  controllerPath:string = "api/GroceryList/";

  constructor(private http: HttpClient, @Inject("BASE_URL") private url:string) {
    this.baseURL = url;
   }

  getSavedIngredients(): Observable<GroceryList[]> { //list all ingredients in the shopping list
    return this.http.get<GroceryList[]>(this.baseURL + this.controllerPath);
  }

  getOneIngredient(id:number): Observable<GroceryList> { //gets one ingredient from the shopping list
    return this.http.get<GroceryList>(this.baseURL + this.controllerPath + `${id}`);
  }

  updateOneIngredient(id:number, newIng: GroceryList): Observable<any>{ //updates an ingredient in the list by index, and by passing it a new value
    return this.http.put(this.baseURL + this.controllerPath + `${id}`, newIng);
  }

  postIngredient(newIng : GroceryList):Observable<any> { //Adds a new ingredient to DB
    return this.http.post(this.baseURL + this.controllerPath, newIng);
  }

  deleteIngredient(id:number): Observable<any> { //Removes an ingredient from DB
    return this.http.delete(this.baseURL + this.controllerPath+ id);
  }

}
