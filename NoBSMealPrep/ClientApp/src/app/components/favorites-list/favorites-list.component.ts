import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavDbService } from 'src/app/services/fav-db.service';
import { FavoriteRecipe } from 'src/interfaces/FavoriteRecipe';
import { UserDbService } from 'src/app/services/user-db.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { User } from 'src/interfaces/User';

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.css']
})
export class FavoritesListComponent implements OnInit {

   //complete list
  favoritesList:FavoriteRecipe[] = [];

   //filtered list by Favoritedby value
  favoritesbyUserList:FavoriteRecipe[] = [];

  favoritedBy : number = 0;

  //User login info imported through social Auth service.
  user: SocialUser = {} as SocialUser;

  loggedIn: boolean = false;

  trigger: boolean = false;

  sub: any;

  constructor(private fav: FavDbService, private router:Router, private authService: SocialAuthService, private userDb:UserDbService) { }

  listFavRecipes() {
    //clears list
    this.favoritesList=[];
    this.favoritesbyUserList=[]; 

    //gets ID of the current user, and subscribes to the database to get info
    this.userDb.getOneUser(this.user.id).subscribe((result:User) => {
      this.favoritedBy = result.id;

      //gets the list of favorites that were favorited by the user (based on matching Favoritedby value in the DB)
      this.fav.getFavoriteList().subscribe((results:FavoriteRecipe[]) => {
        this.favoritesList = results;
        for(let i=0; i<this.favoritesList.length; i++){
          if (this.favoritesList[i].favoritedby === this.favoritedBy){
            this.favoritesbyUserList.push(this.favoritesList[i]); //adds all favorited results to the user's favorites list
          }      
        }
      });
    });
  }

  deleteOneFavRecipe(id:number, localId : number){
    this.fav.deleteFavoriteRecipe(id).subscribe(() => {
      this.favoritesList.splice(localId, 1);
      this.favoritesbyUserList.splice(localId, 1);
    });
  }

  ngOnInit(): void {
    this.sub = this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

      this.listFavRecipes();
    });
  }

  displayFavoriteInfo(URI: any){
    this.trigger === true;

    let IDFormatted : string[] = URI.split('_');
		// return IDFormatted[1];

		this.router.navigate([`/favorites-view/${IDFormatted[1]}`])
	}

  //Activates when user navigates away from the page.
  //If anything is present in 'sub' this will clear all saved data on the page. Prevents memory/performance issues.
  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
