import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavDbService } from 'src/app/services/fav-db.service';
import { GroceryDbService } from 'src/app/services/grocery-db.service';
import { UserDbService } from 'src/app/services/user-db.service';
import { FavoriteRecipe } from 'src/interfaces/FavoriteRecipe';
import { GroceryList } from 'src/interfaces/GroceryList';
import { User } from 'src/interfaces/User';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.css']
})
export class GroceryListComponent implements OnInit {

  //Complete list of grocery items in favorite list
  favoriteGroceryItems:GroceryList[] = [];

  //specific list of grocery items added to grocery list by User
  favoriteGroceryItemsByUser:GroceryList[] = []; 

  //complete list of fav recipes
  favoriteRecipes:FavoriteRecipe[] = [];

  //specific recipes added to favorite list by User
  favoritesbyUserList:FavoriteRecipe[] = [];

  //placeholder num for the foreign key in the FavoriteRecipe SQL table
  favoritedBy : number = 0;

  //User login info imported through social Auth service.
  user: SocialUser = {} as SocialUser;

  //Contains information for updates to GroceryList item
  ingToUpdate: GroceryList = {} as GroceryList;

  //Holds t or f information for items in array.
  isEdited: boolean[]=[];

  //Holds recipe names for the ingredients in each list
  recipeNames:any[] = [];

  sub: any;

  loggedIn: boolean = false;


  constructor(private groceryDb:GroceryDbService, private fav: FavDbService, private router:Router, private authService:SocialAuthService, private userDb:UserDbService) { }
  
  ngOnInit(): void {
  
    this.sub = this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

    this.listGroceries();
    });
  }

  listGroceries(){
    //clears all lists
    this.favoriteGroceryItems=[];
    this.favoriteGroceryItemsByUser=[];
    this.favoriteRecipes=[];
    this.favoritesbyUserList=[];
    this.recipeNames=[];
    this.isEdited=[];
    this.ingToUpdate = {} as GroceryList;

    //gets ID of the current user, and subscribes to the database to get info
    this.userDb.getOneUser(this.user.id).subscribe((result:User) => {
      this.favoritedBy = result.id;

      //Gets the favorite list from the database, then compares foreign keys with this.favoritedBy:number,
      //and if this.favoritedby matches the foreign key, then it pushes that recipe to the favoritesByUserList array.
      this.fav.getFavoriteList().subscribe((results:FavoriteRecipe[]) => {
        this.favoriteRecipes = results;
        for(let i=0; i<this.favoriteRecipes.length; i++){
          if (this.favoriteRecipes[i].favoritedby === this.favoritedBy){

             //adds all favorited results to the user's favorites list
            this.favoritesbyUserList.push(this.favoriteRecipes[i]);
          }      
        }
      
        this.groceryDb.getSavedIngredients().subscribe ((results:GroceryList[]) => {
          this.favoriteGroceryItems = results;

          //find foreign key of favoritesbyUserList, compare with favoriteGroceryItems' ID, 
          //then add specific grocery items to favoriteGroceryItemsByUser

          let favoriteRecipeIds:any[] = [];

          for(let i=0; i < this.favoritesbyUserList.length; i++){

            //Adds ID to favorite RecipeIds if does not already exist. 
            if(favoriteRecipeIds.includes(this.favoritesbyUserList[i].id) !== true) 
            {
              favoriteRecipeIds.push(this.favoritesbyUserList[i].id);
            }
          }
          
          for(let i=0; i < this.favoriteGroceryItems.length; i++){

            //Adds parentRecipe Id to favoriteGroceryItemsByUser if they match.
            if(favoriteRecipeIds.includes(this.favoriteGroceryItems[i].parentRecipe) === true){     
              this.favoriteGroceryItemsByUser.push(this.favoriteGroceryItems[i]);
            }
          }

          //Find the name of the recipe for each group of ingredients in the Grocery List.
          for(let i=0; i < this.favoriteGroceryItemsByUser.length; i++){
            if(favoriteRecipeIds.includes(this.favoriteGroceryItemsByUser[i].parentRecipe) === true){

              for(let j=0; j < this.favoritesbyUserList.length; j++){
                if(this.favoritesbyUserList[j].id === this.favoriteGroceryItemsByUser[i].parentRecipe){
                  this.recipeNames.push(this.favoritesbyUserList[j].label)
                }
              }
            }
          }

          for(let i=0; i < this.favoriteGroceryItemsByUser.length; i++) {
            this.isEdited.push(false);
          }

        });
      });
    });
  }

  openEditTray(index : number, food : string, measure : string, quantity : number){

  this.ingToUpdate.food = food;
  this.ingToUpdate.measure = measure;
  this.ingToUpdate.quantity = quantity;

  this.isEdited[index] = true;
  }

  closeEditTray(index : number){
    this.isEdited[index] = false;
  }

  editIngredient(id : number, localId : number){

    this.ingToUpdate.id = id;
    this.ingToUpdate.parentRecipe = this.favoriteGroceryItemsByUser[localId].parentRecipe;

    this.groceryDb.updateOneIngredient(id, this.ingToUpdate).subscribe(() => {
      this.listGroceries();
    });
  }

  //Deletes a specific ingredient from the user's grocery list
  //Passes the ingredient ID to SQL, splices from lists at local index
  deleteIngredient(id : number, localId :  number){
    this.groceryDb.deleteIngredient(id).subscribe(() => {
      this.favoriteGroceryItems.splice(localId, 1);
      this.favoriteGroceryItemsByUser.splice(localId, 1);
      this.recipeNames.splice(localId, 1);
    });
  }

  //Deletes all ingredients in the user's current shopping list.
  //Uses the same logic as above, but applied iteratively across all items in array.
  deleteAllIngredients() {
    for(let i=0; i < this.favoriteGroceryItemsByUser.length; i++) {
      this.groceryDb.deleteIngredient(this.favoriteGroceryItemsByUser[i].id).subscribe(() => {
      });
    }
    this.favoriteGroceryItems.splice(0, this.favoriteGroceryItems.length);
    this.favoriteGroceryItemsByUser.splice(0, this.favoriteGroceryItemsByUser.length);
    this.recipeNames.splice(0, this.recipeNames.length);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

}
