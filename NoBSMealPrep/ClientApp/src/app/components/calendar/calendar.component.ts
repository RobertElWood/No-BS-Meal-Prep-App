import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
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

  favoriteRecipesByUser: FavoriteRecipe[]=[];

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
          this.createCalendar(this.calendarDataByUser[i].label, this.calendarDataByUser[i].day, this.calendarDataByUser[i].meal);
        }
    });
  }


  //Places item in the calendar at the appropriate index of each array property (e.g. breakfastItems)
  //Bound to each <td> value in calendar by [(ngModel)].
  updateCalendar(){
    //conditional, check values in arrays first
    //prompt the user: Hey, there's something in this slot...Would you like to replace this meal, or add?
    //Take user input. If they type "add" (or click a button), concat to the item then push
    //if they click replace, then replace with text and PUT it in place at the id of the object in question.

    //Could also do this with a trigger which makes a new input field in the html appear instead of a prompt.
    //When the conditional for "hey, there's something in this slot" is triggered...
    //Have a method be activated within that conditional which causes the dialog box to appear.

    //THEN, bind the resulting dialog buttons to methods which A) REPLACE the value, or B) CONCAT to the value

    let inotEmpty:boolean = false;


      if(this.submitMeal === 'Breakfast') {

        let targetIndex : number = this.daysOfWeek.indexOf(this.submitDay);

        //if there something at target index not null.
        if(this.breakfastItems[targetIndex] !== null ) {
          //prompt user to edit old one OR add to existing recipe string.
          this.askToUpdate();
        }
        
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
    
      let newCalItem : Calendar = {label: this.submitLabel, day: this.submitDay, meal: this.submitMeal, userInfo: this.currentUser.id} as Calendar;

      this.calendarDb.postCalendarItem(newCalItem).subscribe(() => {});
  }

  //Just the same as updateCalendar(), but doesn't interact with ngModel
  //Instead, can be fed values for calendar as parameters
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

  deleteCalItem(label: string, meal: string, day: string){

    this.calendarDb.getCalendarItems().subscribe((results: Calendar[]) => {
      this.calendarData = results;
  
      let userData : Calendar[] = [];

      let foundCal : Calendar = {} as Calendar;

      for(let i = 0; i < this.calendarData.length; i++) {
        if(this.calendarData[i].userInfo === this.currentUser.id) {
            userData.push(this.calendarData[i]);
          }
        }

       for(let i = 0; i < userData.length; i++){
        if(userData[i].label === label){
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
  
  askToUpdate() { //popup with buttons
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

        let id : number=0;
        /////PICK UP HERE


        this.submitLabel
        this.calendarDb.getSingleCalendarItem(id).subscribe


        // this.calendarDb.updateCalendarItem

        Swal.fire('Replacing', 'Replaced the old recipe with your new recipe', 'info' );
      }
      else if (result.isDenied) {
        Swal.fire('Updating', 'Your new Recipe was added to this meal', 'info' );
      } 
      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'No changes made', 'error'); //put code for yes here
      }
    });
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
