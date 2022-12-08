import { Component, OnInit } from '@angular/core';
import { FavDbService } from 'src/app/services/fav-db.service';
import { FavoriteRecipe } from 'src/interfaces/FavoriteRecipe';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  favoriteRecipes: FavoriteRecipe[] = [];

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

  constructor(private fav : FavDbService) {}
  
  ngOnInit(): void {
    this. sub= this.fav.getFavoriteList().subscribe((results: FavoriteRecipe[]) => {
      this.favoriteRecipes = results;
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
