import { Component, OnInit } from '@angular/core';
import { GroceryDbService } from 'src/app/services/grocery-db.service';
import { GroceryList } from 'src/interfaces/GroceryList';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.css']
})
export class GroceryListComponent implements OnInit {

  favoriteGroceryItems:GroceryList[] = [];

  constructor(private groceryDb:GroceryDbService) { }

  
  ngOnInit(): void {
    this.groceryDb.getSavedIngredients().subscribe ((results:GroceryList[]) => {
      this.favoriteGroceryItems = results;
    })
  }

  

}
