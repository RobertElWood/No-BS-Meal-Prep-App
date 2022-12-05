import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavMenuComponent } from 'src/app/nav-menu/nav-menu.component';
import { RecipeService } from 'src/app/services/recipe.service';
import { SingleRecipe } from 'src/interfaces/SingleRecipe';
import { FavoriteRecipe } from 'src/interfaces/FavoriteRecipe';
import { User } from 'src/interfaces/User';
import { UserDbService } from 'src/app/services/user-db.service';
import { FavDbService } from 'src/app/services/fav-db.service';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent implements OnInit {

  searchID: any;

  //recipe that current user is viewing; the recipe that is FOUND from the api
  foundRecipe: SingleRecipe[] = [];
  
  //empty recipe object. Holds information for the favorite to be passed to DB
  savedRecipe: FavoriteRecipe = {} as FavoriteRecipe;

  //empty user object. Holds information to be passed to DB for a new user.
  savedUser: User = {} as User;

  //Changes to true when the logged in user currently matches a user already in database.
  found: boolean = false;

  //Holds information from user AFTER posted to db, in order to make sure savedRecipe has the correct foreign key.
  userPosted: User = {} as User;

  //User login info imported through social Auth service.
  user: SocialUser = {} as SocialUser;
  
  loggedIn: boolean = false;

  constructor(private recipeAPI : RecipeService, private favRecipeAPI : FavDbService, private route : ActivatedRoute, private router : Router, private authService: SocialAuthService, private userDb: UserDbService) { }

  //placeholder to hold 'subscribe' data for ngOnDestroy method
  sub : any;

  //When the page loads, subscribes to paramMap to get ID, and subscribes to service to get recipe at that ID.
  //Also, initializes the authservice to check if there is a user logged in when page loads.
  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      this.searchID = params.get('id');
      this.recipeAPI.getSpecificRecipe(this.searchID).subscribe((result : SingleRecipe) => {this.foundRecipe.push(result)});
      
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
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
    this.router.navigate(['recipe-list'])
  }

  checkUser() {
    //checks if anyone is logged in and if they're in our database; otherwise displays an alert that they need to login
    if (this.loggedIn === true) {
      let currentUsers:User[] = [];
      this.userDb.getUsers().subscribe((result: User[]) => {
        currentUsers = result;
        this.saveFavRecipe(currentUsers);
      
      });
    }
    else {
      alert("Please log in to save this recipe to your favorites!");
    }
  }

  //iterates through users to see if they are logged in 
  saveFavRecipe(currentUsers: User[]) {
    for (let i = 0; i < currentUsers.length; i++){
      if (currentUsers[i].logininfo === this.user.id) {
        this.found = true;
      }
    }
    if (this.found === false) { //If the user id isn't in our database, will populate 'savedUser', posting that to the DB.
      this.savedUser.id = 0;
      this.savedUser.username = this.user.name;
      this.savedUser.logininfo = this.user.id;

      this.userDb.postUser(this.savedUser).subscribe((result: User) => {this.userPosted = result //After posting new user, populates SavedRecipe property and posts that to DB as a favorited recipe.
        this.savedRecipe.label = this.foundRecipe[0].recipe.label;
        this.savedRecipe.image = this.foundRecipe[0].recipe.image;
        this.savedRecipe.uri = this.foundRecipe[0].recipe.uri;
        this.savedRecipe.calories = this.foundRecipe[0].recipe.calories;
        this.savedRecipe.favoritedby = this.userPosted.id;

        console.log("IF: the id of the person posted is: " + this.userPosted.id);

        this.favRecipeAPI.postFavoriteRecipe(this.savedRecipe).subscribe((resultrecipe: FavoriteRecipe) => {console.log(resultrecipe)});
        alert("Your recipe has been successfully saved!");
      });
      
    } 
    else { //If the user IS in our database, will
      this.userDb.getOneUser(this.user.id).subscribe((result: User) => {
        this.userPosted = result;
        this.savedRecipe.label = this.foundRecipe[0].recipe.label;
        this.savedRecipe.image = this.foundRecipe[0].recipe.image;
        this.savedRecipe.uri = this.foundRecipe[0].recipe.uri;
        this.savedRecipe.calories = this.foundRecipe[0].recipe.calories;
        this.savedRecipe.favoritedby = this.userPosted.id;

        console.log("ELSE: the id of the person posted is:" + this.userPosted.id);

        this.favRecipeAPI.postFavoriteRecipe(this.savedRecipe).subscribe((resultrecipe: FavoriteRecipe) => {console.log(resultrecipe)});
        alert("Your recipe has been successfully saved!");
      });
    }
  }
  
  //Maybe include a check for if a recipe is ALREADY in someone's favorites, as well?
  //If so, display an alert which tells the user this information.

}
