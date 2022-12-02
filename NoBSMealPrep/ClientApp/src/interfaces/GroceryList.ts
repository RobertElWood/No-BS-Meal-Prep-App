import { FavoriteRecipe } from "./FavoriteRecipe";

export interface GroceryList {
    id: number;
    food: string | null;
    quantity: number | null;
    measure: string | null;
    parentRecipe: number | null;
    parentRecipeNavigation: FavoriteRecipe | null;
}