import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavMenuComponent } from 'src/app/nav-menu/nav-menu.component';
import { RecipeService } from 'src/app/services/recipe.service';
import { SingleRecipe } from 'src/interfaces/SingleRecipe';
import { FavoriteRecipe } from 'src/interfaces/FavoriteRecipe';
import { User } from 'src/interfaces/User';
import { UserDbService } from 'src/app/services/user-db.service';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent implements OnInit {

  searchID: any;

  //recipe that current user is viewing; the recipe that is FOUND from the api

  foundRecipe: SingleRecipe[] = [];
  
  savedRecipe: FavoriteRecipe = {} as FavoriteRecipe;

  savedUser: User = {} as User;

  found: boolean = false;

  userPosted: User = {} as User;

  constructor(private recipeAPI : RecipeService, private route : ActivatedRoute, private router : Router, private authService: SocialAuthService, private userDb: UserDbService) { }

  //placeholder to hold 'subscribe' data for ngOnDestroy method
  sub : any;

  //When the page loads, subscribes to paramMap to get ID, and subscribes to service to get recipe at that ID.
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
    this.router.navigate(['recipe-list'])
  }

  
  checkUser() {
    //checks if anyone is logged in and if they're in our database; otherwise displays an alert that they need to login
    if (NavMenuComponent.loggedIn === true) {
      let currentUsers:User[] = [];
      this.userDb.getUsers().subscribe((result: User[]) => {
        currentUsers = result;
        this.saveFavRecipe(currentUsers);
      
      });
      if (this.userDb) {
        
      }
    }
    else {
      alert("Please log in to save this recipe to your favorites!");
    }
  }

  //iterates through users to see if they are logged in 
  saveFavRecipe(currentUsers: User[]) {
    for (let i = 0; i < currentUsers.length; i++){
      if (currentUsers[i].logininfo === NavMenuComponent.user.id) {
        this.found = true;
      }
    }
    if (this.found === false) {
      this.savedUser.id = 0;
      this.savedUser.username = NavMenuComponent.user.name;
      this.savedUser.logininfo = NavMenuComponent.user.id;

      this.userDb.postUser(this.savedUser).subscribe((result: any) => { console.log(result)});
      
      
      this.userDb.getOneUser(this.savedUser.logininfo).subscribe((result: User) => {
        this.userPosted = result;
      });
      //include lagnuage to post your favorite recipe at the id of userposted
    }
    //include else clause to say what happens if user is already in database
  }
}
