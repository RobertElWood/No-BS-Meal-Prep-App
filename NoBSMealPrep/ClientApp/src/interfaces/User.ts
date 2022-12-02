import { FavoriteRecipe } from "./FavoriteRecipe";

export interface User {
    id: number;
    username: string | null;
    logininfo: string | null;
    favoriteRecipes: FavoriteRecipe[];
}