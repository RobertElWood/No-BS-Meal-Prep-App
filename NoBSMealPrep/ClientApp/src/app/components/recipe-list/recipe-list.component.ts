import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeList } from 'src/interfaces/RecipeList';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: [ './recipe-list.component.css' ]
})
export class RecipeListComponent implements OnInit {
	recipes: RecipeList[] = [];

	keywords: string = '';

	health: string = 'test';

	type: string = 'test';

	constructor(private recipeAPI: RecipeService) {}

	searchRecipes() {
		console.log(this.health);
		console.log(this.type);
		this.recipeAPI.getRecipes(this.keywords, this.health, this.type).subscribe((results: RecipeList) => {
			this.recipes.push(results);
		});
	}

	ngOnInit(): void {}
}
