import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeList } from 'src/interfaces/RecipeList';
import { Recipe } from 'src/interfaces/Recipe';
import { Secret } from '../secret';
import { format } from 'path';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  baseURL: string = 'https://api.edamam.com/api/recipes/v2';
  
  constructor(private http : HttpClient) { }
  
  //split and join keywords before call, keyword spaces = %20
  //(typeof type !== 'undefined' && typeof health !== 'undefined')
  getRecipes(keywords: string, health?: string, type?: string) : Observable<RecipeList> {

    let keyWordsFormatted = this.formatKeywords(keywords);

    if(typeof health === 'undefined')
    {
    return this.http.get<RecipeList>(this.baseURL + `?type=public&q=${keyWordsFormatted}&app_id=${Secret.app_id}&app_key=${Secret.app_key}&cuisineType=${type}`);
    }
    else if (typeof type === 'undefined')
    {
      return this.http.get<RecipeList>(this.baseURL + `?type=public&q=${keyWordsFormatted}&app_id=${Secret.app_id}&app_key=${Secret.app_key}&health=${health}`);
    } 
    else
    {
      return this.http.get<RecipeList>(this.baseURL + `?type=public&q=${keyWordsFormatted}&app_id=${Secret.app_id}&app_key=${Secret.app_key}&health=${health}&cuisineType=${type}`);
    }

  }

  // getSpecificRecipe() : Observable<Recipe> {

  // }

  formatKeywords(keywords : string) : string {

    let keyWordsFormatted : string = keywords.split('').join('%20');
    return keyWordsFormatted

  }

}
