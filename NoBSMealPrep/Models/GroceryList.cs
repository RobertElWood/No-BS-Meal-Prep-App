using System;
using System.Collections.Generic;

namespace NoBSMealPrep.Models;

public partial class GroceryList
{
    public int Id { get; set; }

    public string? Food { get; set; }

    public double? Quantity { get; set; }

    public string? Measure { get; set; }

    public int? ParentRecipe { get; set; }

    public virtual FavoriteRecipe? ParentRecipeNavigation { get; set; }
}
