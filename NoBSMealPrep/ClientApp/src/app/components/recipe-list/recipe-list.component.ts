import { Component, Input, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeList } from 'src/interfaces/RecipeList';
import { ActivatedRoute, Router } from '@angular/router';
import { SingleRecipe } from 'src/interfaces/SingleRecipe';

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

	constructor(private recipeAPI: RecipeService, private router:Router) {}

	searchRecipes() {
		this.recipes=[]; //clears/empties recipe array		
		this.recipeAPI.getRecipes(this.keywords, this.health, this.type).subscribe((results: RecipeList) => {
			this.recipes.push(results);
		});
	}

	ngOnInit(): void {
	}

	getId(URI: string) {
		let IDFormatted : string[] = URI.split('_');

		this.router.navigate([`/recipe-view/${IDFormatted[1]}`])
	}
}
