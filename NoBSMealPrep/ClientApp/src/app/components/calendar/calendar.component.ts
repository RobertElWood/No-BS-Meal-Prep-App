import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarDbService } from 'src/app/services/calendar-db.service';
import { FavDbService } from 'src/app/services/fav-db.service';
import { UserDbService } from 'src/app/services/user-db.service';
import { Calendar } from 'src/interfaces/Calendar';
import { FavoriteRecipe } from 'src/interfaces/FavoriteRecipe';
import { User } from 'src/interfaces/User';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  favoriteRecipes: FavoriteRecipe[] = [];

  favoriteRecipesByUser: FavoriteRecipe[] = [];

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

  constructor(private fav : FavDbService, private calendarDb : CalendarDbService, private userDb : UserDbService, private authService : SocialAuthService, private router : Router) {}
  
  ngOnInit(): void {
    this. sub = this.sub = this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

      this.favoriteRecipes=[];
      this.favoriteRecipesByUser=[];

        this.fav.getFavoriteList().subscribe((results: FavoriteRecipe[]) => {
          this.favoriteRecipes = results;

          this.userDb.getOneUser(this.user.id).subscribe((result : User) => {
            this.currentUser = result;
      
            for(let i=0; i < this.favoriteRecipes.length; i++){
              if (this.favoriteRecipes[i].favoritedby === this.currentUser.id){
                this.favoriteRecipesByUser.push(this.favoriteRecipes[i]); //adds all favorited results to the user's favorites list
              }
            }      

            this.getUserCalendar();

          });
        });
    });
  }


  //Gets current user data, then sorts calendar data in Db by user
  //Creates calendar based on the sorted calendar data.
  //Calls the createCalendar() method to do this.
  getUserCalendar() {
    this.calendarData=[];
    this.calendarDataByUser=[];

    this.calendarDb.getCalendarItems().subscribe((results: Calendar[]) => {
    this.calendarData = results;
          
      for(let i = 0; i < this.calendarData.length; i++) {
        if(this.calendarData[i].userInfo === this.currentUser.id) {
            this.calendarDataByUser.push(this.calendarData[i]);
          }
        }

        for(let i = 0; i < this.calendarDataByUser.length; i++) {
          if(this.calendarDataByUser[i].label.includes('%%')){
            this.calendarDataByUser[i].label = this.calendarDataByUser[i].label.split('%%');
          }
        }

        for(let i = 0; i < this.calendarDataByUser.length; i++) {
          this.createCalendar(this.calendarDataByUser[i].label, this.calendarDataByUser[i].day, this.calendarDataByUser[i].meal);
        }
    });
  }


  //Places item in the calendar at the appropriate index of each array property (e.g. breakfastItems)
  //Gets its values from submitDay, Meal and Label, which are bound by [(ngModel)] to user input.
  //If there is already a value in each index array, will call the askToUpdate method instead.
  updateCalendar(){

      if(this.submitMeal === 'Breakfast') {

        let targetIndex : number = this.daysOfWeek.indexOf(this.submitDay);

        //if there something at target index not null.
        if(this.breakfastItems[targetIndex] !== null ) {
          //prompt user to edit old one OR add to existing recipe string.
          this.askToUpdate(this.breakfastItems[targetIndex]);
        } 
        else 
        {
          this.breakfastItems[targetIndex] = this.submitLabel;

          let newCalItem : Calendar = {label: this.submitLabel, day: this.submitDay, meal: this.submitMeal, userInfo: this.currentUser.id} as Calendar;

          this.calendarDb.postCalendarItem(newCalItem).subscribe(() => {});
        }
        
      } 
      else if(this.submitMeal === 'Lunch') {

        let targetIndex : number = this.daysOfWeek.indexOf(this.submitDay);

        //if there something at target index not null.
        if(this.lunchItems[targetIndex] !== null ) {
          //prompt user to edit old one OR add to existing recipe string.
          this.askToUpdate(this.lunchItems[targetIndex]);
        } 
        else 
        {
          this.lunchItems[targetIndex] = this.submitLabel;

          let newCalItem : Calendar = {label: this.submitLabel, day: this.submitDay, meal: this.submitMeal, userInfo: this.currentUser.id} as Calendar;

          this.calendarDb.postCalendarItem(newCalItem).subscribe(() => {});
        }
        
      } 
      else if(this.submitMeal === 'Dinner') {

        let targetIndex : number = this.daysOfWeek.indexOf(this.submitDay);

          //if there something at target index not null.
          if(this.dinnerItems[targetIndex] !== null ) {
            //prompt user to edit old one OR add to existing recipe string.
            this.askToUpdate(this.dinnerItems[targetIndex]);
          } 
          else 
          {
            this.dinnerItems[targetIndex] = this.submitLabel;
  
            let newCalItem : Calendar = {label: this.submitLabel, day: this.submitDay, meal: this.submitMeal, userInfo: this.currentUser.id} as Calendar;
  
            this.calendarDb.postCalendarItem(newCalItem).subscribe(() => {});
          }
      } 
      else if(this.submitMeal === 'Snacks') {

        let targetIndex : number = this.daysOfWeek.indexOf(this.submitDay);

        //if there something at target index not null.
        if(this.snacksItems[targetIndex] !== null ) {
          //prompt user to edit old one OR add to existing recipe string.
          this.askToUpdate(this.snacksItems[targetIndex]);
        } 
        else 
        {
          this.snacksItems[targetIndex] = this.submitLabel;

          let newCalItem : Calendar = {label: this.submitLabel, day: this.submitDay, meal: this.submitMeal, userInfo: this.currentUser.id} as Calendar;

          this.calendarDb.postCalendarItem(newCalItem).subscribe(() => {});
        }
      } 
  }

  //Just the same as updateCalendar(), but doesn't interact with ngModel
  //Instead, can be fed values for calendar as parameters
  createCalendar(Label: any, Day: any, Meal: any){

    if(Meal === 'Breakfast') {

      let targetIndex : number = this.daysOfWeek.indexOf(Day);

      this.breakfastItems[targetIndex] = Label;
    } 
    else if(Meal === 'Lunch') {

      let targetIndex : number = this.daysOfWeek.indexOf(Day);

      this.lunchItems[targetIndex] = Label;
    } 
    else if(Meal === 'Dinner') {

      let targetIndex : number = this.daysOfWeek.indexOf(Day);

      this.dinnerItems[targetIndex] = Label;
    } 
    else if(Meal === 'Snacks') {

      let targetIndex : number = this.daysOfWeek.indexOf(Day);

      this.snacksItems[targetIndex] = Label;
    } 
  }

  deleteCalItem(label: any, meal: string, day: string){

    this.calendarDb.getCalendarItems().subscribe((results: Calendar[]) => {
      this.calendarData = results;
  
      let userData : Calendar[] = [];

      let foundCal : Calendar = {} as Calendar;

      let labelFormatted : string;


      if(Array.isArray(label) === true) {
        labelFormatted = label.join('%%');
      } 
      else
      {
        labelFormatted = label;
      }


      for(let i = 0; i < this.calendarData.length; i++) {
        if(this.calendarData[i].userInfo === this.currentUser.id) {
            userData.push(this.calendarData[i]);
          }
        }

       for(let i = 0; i < userData.length; i++){
        if(userData[i].label === labelFormatted){
          if(userData[i].meal === meal) {
            if(userData[i].day === day){
              foundCal = userData[i];
            }
          }
        }
       }

      this.calendarDb.deleteCalendarItem(foundCal.id).subscribe(() => {
        
        let index = this.daysOfWeek.indexOf(day);
      
        if(meal === 'Breakfast'){

          this.breakfastItems[index] = null;
        }
        else if(meal === 'Lunch') {

          this.lunchItems[index] = null;
        } 
        else if(meal === 'Dinner') {
    
          this.dinnerItems[index] = null;
        } 
        else if(meal === 'Snacks') {

          this.snacksItems[index] = null;
        } 

      });
    })
  }

//sweetAlert 2 buttons --> https://sweetalert2.github.io/#configuration  - URL to sweetAlert2 home'
  
  askToUpdate(recipeName : any) { //popup with buttons
    Swal.fire({
      title: 'What would you like?',
      text: 'There is already a recipe at this meal time',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: '#344966',
      denyButtonColor: '#344966',
      confirmButtonText: 'Replace this recipe?',
      denyButtonText: 'Add another recipe?',
      cancelButtonText: 'Cancel',

    }).then((result) => {
      if (result.value) {
        //if the user wants to replace old recipe with new one
        

        let newCalItem : Calendar = {} as Calendar;

        let submitId : number;
        let calArray : Calendar[] = [];


        this.calendarDb.getCalendarItems().subscribe((results: Calendar[]) => {
          calArray = results;

          for(let i = 0; i < calArray.length; i++){
            if((calArray[i].label === recipeName) && (calArray[i].day === this.submitDay) && (calArray[i].meal === this.submitMeal)) {
              submitId = calArray[i].id;
            }
          }

          newCalItem.id = submitId;
          newCalItem.label = this.submitLabel;
          newCalItem.day = this.submitDay;
          newCalItem.meal = this.submitMeal;
          newCalItem.userInfo = this.currentUser.id;

          this.calendarDb.updateCalendarItem(submitId, newCalItem).subscribe(() => {
            this.createCalendar(this.submitLabel, this.submitDay, this.submitMeal);
          });
        });

        Swal.fire('Replaced!', 'Replaced the old recipe with your new recipe!', 'info');

      }
      else if (result.isDenied) {

        let newCalItem : Calendar = {} as Calendar;

        let submitId : number;
        let calArray : Calendar[] = [];

        let nameArray : string[] = [];
        
        let newName : string;
        let currentName : string;

        if(Array.isArray(recipeName) === true){

          nameArray = recipeName;
          currentName = recipeName.join('%%');

          nameArray.push(this.submitLabel);
          newName = nameArray.join('%%');

        } 
        else
        {
          nameArray[0] = recipeName;
          nameArray[1] = this.submitLabel;

          newName = nameArray.join('%%');
        }

        this.calendarDb.getCalendarItems().subscribe((results: Calendar[]) => {
          calArray = results;

          if(Array.isArray(recipeName) === true) { 
            for(let i = 0; i < calArray.length; i++){
              if((calArray[i].label === currentName) && (calArray[i].day === this.submitDay) && (calArray[i].meal === this.submitMeal)) {
                submitId = calArray[i].id;
              }
            }
          } 
          else 
          {
            for(let i = 0; i < calArray.length; i++){
              if((calArray[i].label === recipeName) && (calArray[i].day === this.submitDay) && (calArray[i].meal === this.submitMeal)) {
                submitId = calArray[i].id;
              }
            }
          }
           
          newCalItem.id = submitId;
          newCalItem.label = newName;
          newCalItem.day = this.submitDay;
          newCalItem.meal = this.submitMeal;
          newCalItem.userInfo = this.currentUser.id;

          this.calendarDb.updateCalendarItem(submitId, newCalItem).subscribe(() => {
            this.createCalendar(nameArray, this.submitDay, this.submitMeal);     
          });
        });

        Swal.fire('Adding!', 'Your new Recipe was added on to this meal', 'info' );

      } 
      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'No changes made', 'error'); //put code for yes here
      }
    });
  }

  checkIfArray(tdValue : any) {
    return Array.isArray(tdValue);
  }

  listArray(tdValue : any[]){
    return tdValue.join(' ');
  }

  //Toggles custom entry tray on and off
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
