import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { CalendarDbService } from 'src/app/services/calendar-db.service';
import { FavDbService } from 'src/app/services/fav-db.service';
import { UserDbService } from 'src/app/services/user-db.service';
import { Calendar } from 'src/interfaces/Calendar';
import { FavoriteRecipe } from 'src/interfaces/FavoriteRecipe';
import { User } from 'src/interfaces/User';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  favoriteRecipes: FavoriteRecipe[] = [];

  calendarData: Calendar[] = [];

  currentUser: User = {} as User;

  calendarDataByUser: Calendar[] = [];

  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  meals: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  breakfastItems: any[] = [null, null, null, null, null, null, null];

  lunchItems: any[] = [null, null, null, null, null, null, null];

  dinnerItems: any[] = [null, null, null, null, null, null, null];

  snacksItems: any[] = [null, null, null, null, null, null, null];

  submitLabel: string = "";

  submitDay: string = "";

  submitMeal: string = "";

  customTrigger: boolean = false;

  sub: any;
 
  user: SocialUser = {} as SocialUser;

  loggedIn: boolean = false;

  constructor(private fav : FavDbService, private calendarDb : CalendarDbService, private userDb : UserDbService, private authService : SocialAuthService) {}
  
  ngOnInit(): void {
    this. sub = this.sub = this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

        this.fav.getFavoriteList().subscribe((results: FavoriteRecipe[]) => {
          this.favoriteRecipes = results;

          this.getUserCalendar();

        });
    });
  }

  getUserCalendar() {
    this.calendarData=[];
    this.calendarDataByUser=[];

    this.userDb.getOneUser(this.user.id).subscribe((result : User) => {
      this.currentUser = result;

        this.calendarDb.getCalendarItems().subscribe((results: Calendar[]) => {
          this.calendarData = results;
          
          for(let i = 0; i < this.calendarData.length; i++) {
            if(this.calendarData[i].userInfo === this.currentUser.id) {
              this.calendarDataByUser.push(this.calendarData[i]);
            }
          }

          for(let i = 0; i < this.calendarDataByUser.length; i++) {
            this.createCalendar(this.calendarDataByUser[i].label, this.calendarDataByUser[i].day, this.calendarDataByUser[i].meal);
          }
        });
    });
  }



  //Places item in the calendar at the appropriate index of each array property (e.g. breakfastItems)
  //Bound to each <td> value in calendar by [(ngModel)].
  updateCalendar(){
  
    if(this.submitMeal === 'Breakfast') {

      let targetIndex : number = this.daysOfWeek.indexOf(this.submitDay);

      this.breakfastItems[targetIndex] = this.submitLabel;
    } 
    else if(this.submitMeal === 'Lunch') {

      let targetIndex : number = this.daysOfWeek.indexOf(this.submitDay);

      this.lunchItems[targetIndex] = this.submitLabel;
    } 
    else if(this.submitMeal === 'Dinner') {

      let targetIndex : number = this.daysOfWeek.indexOf(this.submitDay);

      this.dinnerItems[targetIndex] = this.submitLabel;
    } 
    else if(this.submitMeal === 'Snacks') {

      let targetIndex : number = this.daysOfWeek.indexOf(this.submitDay);

      this.snacksItems[targetIndex] = this.submitLabel;
    } 
  
  }

  createCalendar(submitLabel: any, submitDay: any, submitMeal: any){
  
    if(submitMeal === 'Breakfast') {

      let targetIndex : number = this.daysOfWeek.indexOf(submitDay);

      this.breakfastItems[targetIndex] = submitLabel;
    } 
    else if(submitMeal === 'Lunch') {

      let targetIndex : number = this.daysOfWeek.indexOf(submitDay);

      this.lunchItems[targetIndex] = submitLabel;
    } 
    else if(submitMeal === 'Dinner') {

      let targetIndex : number = this.daysOfWeek.indexOf(submitDay);

      this.dinnerItems[targetIndex] = submitLabel;
    } 
    else if(submitMeal === 'Snacks') {

      let targetIndex : number = this.daysOfWeek.indexOf(submitDay);

      this.snacksItems[targetIndex] = submitLabel;
    } 
  
  }

  switchCustomTray(){
    if(this.customTrigger === false) {
      this.customTrigger = true;
    } 
    else if (this.customTrigger === true) {
      this.customTrigger = false;
    }
  }

   //Activates when user navigates away from the page.
  //If anything is present in 'sub' this will clear all saved data on the page. Prevents memory/performance issues.
  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
