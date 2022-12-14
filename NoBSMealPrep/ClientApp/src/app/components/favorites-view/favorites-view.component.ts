import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ingredient, SingleRecipe } from 'src/interfaces/SingleRecipe';
import { FavDbService } from 'src/app/services/fav-db.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { FavoriteRecipe } from 'src/interfaces/FavoriteRecipe';
import { GroceryDbService } from 'src/app/services/grocery-db.service';
import { GroceryList } from 'src/interfaces/GroceryList';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import Swal from 'sweetalert2';
import { UserDbService } from 'src/app/services/user-db.service';
import { User } from 'src/interfaces/User';


@Component({
  selector: 'app-favorites-view',
  templateUrl: './favorites-view.component.html',
  styleUrls: ['./favorites-view.component.css']
})
export class FavoritesViewComponent implements OnInit {
    //placeholder to hold 'subscribe' data for ngOnDestroy method
  sub: any;

  favoritesList:FavoriteRecipe[] = [];

  favoritesListByUser: FavoriteRecipe[] = [];

  searchID: any;

  foundRecipe: SingleRecipe[] = [];

  foundIngredients: Ingredient[] = [];

  ingToAdd: GroceryList = {} as GroceryList;

  user: SocialUser = {} as SocialUser;

  loggedIn: boolean = false;

  ingredientName : any;
  favoritedBy: any;
  
  constructor(private fav: FavDbService,  private recipeAPI: RecipeService, private grocerylistAPI: GroceryDbService, private userDb: UserDbService, private authService: SocialAuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      this.searchID = params.get('id');
      this.recipeAPI.getSpecificRecipe(this.searchID).subscribe((result : SingleRecipe) => {this.foundRecipe.push(result)});
      
        this.fav.getFavoriteList().subscribe((results:FavoriteRecipe[]) => {
          this.favoritesList = results;

            this.sub = this.authService.authState.subscribe((user) => {
              this.user = user;
              this.loggedIn = (user != null);

              this.userDb.getOneUser(this.user.id).subscribe((result:User) => {
                this.favoritedBy = result.id;


                for (let i = 0; i < this.favoritesList.length; i++){
                  if (this.favoritesList[i].favoritedby === this.favoritedBy) {
                    this.favoritesListByUser.push(this.favoritesList[i]);
                  }
                }
              });
            });   
      });
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

  //On click, adds the ingredient the user has selected by filling in values of an empty ingredient object.
  addShoppingIngredient(ingString: string){

    //clears ingredients array
    this.foundIngredients = [];
    

    //Finds ingredients within the API's recipe data that match the recipe string displayed in HTML
    for(let i = 0; i < this.foundRecipe[0].recipe.ingredients.length; i++){
      if(this.foundRecipe[0].recipe.ingredients[i].text === ingString){
        this.foundIngredients.push(this.foundRecipe[0].recipe.ingredients[i]);
      }
    }

    //For each ingredient present in foundIngredients, adds the properties to ingToAdd
    //Then, then will find the appropriate foreign key id. Pushes ingredients to GroceryList table in SQL
      for(let i = 0; i < this.foundIngredients.length; i++) {

        this.ingToAdd.food = this.foundIngredients[i].food;
        this.ingToAdd.quantity = this.foundIngredients[i].quantity;
        this.ingToAdd.measure = this.foundIngredients[i].measure;
        this.ingToAdd.foodCategory = this.foundIngredients[i].foodCategory;

        //make sure the label of the found recipe matches the name of the favorite list recipe being added
        for(let j = 0; j < this.favoritesListByUser.length; j++){
          if(this.favoritesListByUser[j].label === this.foundRecipe[0].recipe.label){
            this.ingToAdd.parentRecipe = this.favoritesListByUser[j].id;
          }
        }
          //if the user is trying to add a duplicate ingredient, 
          //instead it will update the first ingredient entry by doubling the quantity amount
          this.grocerylistAPI.postIngredient(this.ingToAdd).subscribe((result: GroceryList) => {
            // this.ingredientName = result;
            if (result.food === 'This is a duplicate value') {
              let ingToUpdate: GroceryList = this.ingToAdd;
              ingToUpdate.id = result.id;
              ingToUpdate.quantity = result.quantity + this.ingToAdd.quantity;

              this.grocerylistAPI.updateOneIngredient(result.id, ingToUpdate).subscribe(() => {

              });
            }
            console.log(result);
          });
      }
  }

  //Adds all ingredients currently in the recipe to the db
  //Calls previous method iteratively in order to do so.
  addAllIngredients() {
    for(let i = 0; i < this.foundRecipe[0].recipe.ingredientLines.length; i++) {
      this.addShoppingIngredient(this.foundRecipe[0].recipe.ingredientLines[i]);
    }
    this.addedAllToGroceryList();
  }

  //Deletes the recipe in question from the favorites table, then navigates back to the list view.
  deleteOneFavRecipeView(recipeLabel : string){
    for(let i = 0; i < this.favoritesList.length; i++){
      if(this.favoritesList[i].label === recipeLabel){
        this.fav.deleteFavoriteRecipe(this.favoritesList[i].id).subscribe(() => {
          this.router.navigate(['favorites-list']);
        });
      }
    }
  }

  addOneToGroceryList() {
    Swal.fire({
      title: `Added ingredient!`,
      text: 'Check your grocery list for more information.',
      icon: 'success'
    });
  }

  addedAllToGroceryList() {
    Swal.fire({
      title: 'Added all ingredients!',
      text: 'Check your grocery list for more information.',
      icon: 'success'
    });
  }

  reDirect(){
    this.router.navigate(['favorites-list']);
  }

}
