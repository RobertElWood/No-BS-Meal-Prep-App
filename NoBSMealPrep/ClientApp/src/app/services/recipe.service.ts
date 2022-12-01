import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeList } from 'src/interfaces/RecipeList';
import { SingleRecipe } from 'src/interfaces/SingleRecipe';
import { Secret } from '../secret';

@Injectable({
	providedIn: 'root'
})
export class RecipeService {
	baseURL: string = 'https://api.edamam.com/api/recipes/v2';

	constructor(private http: HttpClient) {}

	getRecipes(keywords: string, health?: string, type?: string): Observable<RecipeList> {

		let keyWordsFormatted = this.formatKeywords(keywords);

		if (health !== 'test' && type !== 'test') { //if there is an entry for health AND type
			return this.http.get<RecipeList>(
				this.baseURL +
					`?type=public&q=${keyWordsFormatted}&app_id=${Secret.app_id}&app_key=${Secret.app_key}&health=${health}&cuisineType=${type}`
			);
		} else if (type !== 'test' && health === 'test') { // if there is no type but there is health
			return this.http.get<RecipeList>(
				this.baseURL +
					`?type=public&q=${keyWordsFormatted}&app_id=${Secret.app_id}&app_key=${Secret.app_key}&cuisineType=${type}`
			);
		} else if (type == 'test' && health !== 'test') { //if there is type but no health
			return this.http.get<RecipeList>(
				this.baseURL +
					`?type=public&q=${keyWordsFormatted}&app_id=${Secret.app_id}&app_key=${Secret.app_key}&health=${health}`
			);
		} else {
			return this.http.get<RecipeList>( //if there is no type OR health
				this.baseURL +
					`?type=public&q=${keyWordsFormatted}&app_id=${Secret.app_id}&app_key=${Secret.app_key}`
			);
		}
	}

	getSpecificRecipe(singleId:string) : Observable<SingleRecipe> { //get specific recipe
		return this.http.get<SingleRecipe>(
				this.baseURL +
					`/${singleId}?type=public&app_id=${Secret.app_id}&app_key=${Secret.app_key}`);
	}

	formatKeywords(keywords: string): string {
		let keyWordsFormatted: string = keywords.split(' ').join('%20');
		return keyWordsFormatted;
	}
}
