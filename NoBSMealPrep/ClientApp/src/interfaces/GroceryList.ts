import { FavoriteRecipe } from "./FavoriteRecipe";

export interface GroceryList {
    id: number;
    food: string;
    quantity: number;
    foodCategory: string;
    measure: string;
    parentRecipe: number;
    parentRecipeNavigation: FavoriteRecipe;
}