import { Component, OnInit } from '@angular/core';
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


  constructor() {}
  

  ngOnInit(): void {
  }

}
