import { FavoriteRecipe } from "./FavoriteRecipe";

export interface GroceryList {
    id: number;
    food: string;
    quantity: number;
    measure: string;
    parentRecipe: number;
    parentRecipeNavigation: FavoriteRecipe;
}