import { GroceryList } from "./GroceryList";
import { User } from "./User";

export interface FavoriteRecipe {
    id: number;
    label: string | null;
    image: string | null;
    uri: string | null;
    calories: number | null;
    favoritedby: number | null;
    favoritedbyNavigation: User | null;
    groceryLists: GroceryList[];
}