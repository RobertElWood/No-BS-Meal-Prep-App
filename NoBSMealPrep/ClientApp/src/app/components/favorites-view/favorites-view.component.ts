import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SingleRecipe } from 'src/interfaces/SingleRecipe';
import { FavDbService } from 'src/app/services/fav-db.service';
import { RecipeService } from 'src/app/services/recipe.service';


@Component({
  selector: 'app-favorites-view',
  templateUrl: './favorites-view.component.html',
  styleUrls: ['./favorites-view.component.css']
})
export class FavoritesViewComponent implements OnInit {
    //placeholder to hold 'subscribe' data for ngOnDestroy method
  sub: any;

  searchID: any;
  foundRecipe: SingleRecipe[] = [];

  constructor(private fav: FavDbService, private router:Router, private recipeAPI : RecipeService, private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      this.searchID = params.get('id');
      this.recipeAPI.getSpecificRecipe(this.searchID).subscribe((result : SingleRecipe) => {this.foundRecipe.push(result)});
    });
  }

  //Activates when user navigates away from the page.
  //If anything is present in 'sub' this will clear all saved data on the page. Prevents memory/performance issues.
  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  //This navigates back to the recipe search view when the user clicks the button in recipe-view.component.html
  onBack() : void {
    this.router.navigate(['favorites-list']);
  }


}
