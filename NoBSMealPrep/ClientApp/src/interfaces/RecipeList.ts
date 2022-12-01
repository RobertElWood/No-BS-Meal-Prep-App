export interface RecipeList {
    from:   number;
    to:     number;
    count:  number;
    _links: RecipeListLinks;
    hits:   Hit[];
}

export interface RecipeListLinks {
    next: Next;
}

export interface Next {
    href:  string;
    title: Title;
}

export enum Title {
    NextPage = "Next page",
    Self = "Self",
}

export interface Hit {
    recipe: Recipe;
    _links: HitLinks;
}

export interface HitLinks {
    self: Next;
}

export interface Recipe {
    uri:             string;
    label:           string;
    image:           string;
    images:          Images;
    source:          string;
    url:             string;
    shareAs:         string;
    yield:           number;
    dietLabels:      DietLabel[];
    healthLabels:    string[];
    cautions:        Caution[];
    ingredientLines: string[];
    ingredients:     Ingredient[];
    calories:        number;
    totalWeight:     number;
    totalTime:       number;
    cuisineType:     string[];
    mealType:        MealType[];
    dishType:        string[];
    totalNutrients:  { [key: string]: Total };
    totalDaily:      { [key: string]: Total };
    digest:          Digest[];
}

export enum Caution {
    Fodmap = "FODMAP",
    Gluten = "Gluten",
    Sulfites = "Sulfites",
    Wheat = "Wheat",
}

export enum DietLabel {
    HighFiber = "High-Fiber",
    LowCarb = "Low-Carb",
}

export interface Digest {
    label:        string;
    tag:          string;
    schemaOrgTag: SchemaOrgTag | null;
    total:        number;
    hasRDI:       boolean;
    daily:        number;
    unit:         Unit;
    sub?:         Digest[];
}

export enum SchemaOrgTag {
    CarbohydrateContent = "carbohydrateContent",
    CholesterolContent = "cholesterolContent",
    FatContent = "fatContent",
    FiberContent = "fiberContent",
    ProteinContent = "proteinContent",
    SaturatedFatContent = "saturatedFatContent",
    SodiumContent = "sodiumContent",
    SugarContent = "sugarContent",
    TransFatContent = "transFatContent",
}

export enum Unit {
    Empty = "%",
    G = "g",
    Kcal = "kcal",
    Mg = "mg",
    Μg = "µg",
}

export interface Images {
    THUMBNAIL: Large;
    SMALL:     Large;
    REGULAR:   Large;
    LARGE?:    Large;
}

export interface Large {
    url:    string;
    width:  number;
    height: number;
}

export interface Ingredient {
    text:         string;
    quantity:     number;
    measure:      null | string;
    food:         string;
    weight:       number;
    foodCategory: null | string;
    foodId:       string;
    image:        null | string;
}

export enum MealType {
    Brunch = "brunch",
    LunchDinner = "lunch/dinner",
}

export interface Total {
    label:    string;
    quantity: number;
    unit:     Unit;
}
