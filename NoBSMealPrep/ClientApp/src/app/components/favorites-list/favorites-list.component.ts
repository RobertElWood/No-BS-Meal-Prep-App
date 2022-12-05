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

  constructor(private fav: FavDbService, private router:Router, private authService: SocialAuthService, private userDb:UserDbService) { }

  listFavRecipes() {
    //clears list
    this.favoritesList=[]; 

    //gets ID of the current user, and subscribes to the database to get info
    this.userDb.getOneUser(this.user.id).subscribe((result:User) => {
      this.favoritedBy = result.id;

      //gets the list of favorites that were favorited by the user (based on matching Favoritedby value in the DB)
      this.fav.getFavoriteList().subscribe((results:FavoriteRecipe[]) => {
        this.favoritesList = results;
        for(let i=0; i<this.favoritesList.length; i++){
          if (this.favoritesList[i].favoritedby === this.favoritedBy){
            this.favoritesbyUserList.push(this.favoritesList[i]);
          }
          
        }
        console.log(this.favoritesbyUserList);
      });
    });
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

      this.listFavRecipes();
    });
  }

}
