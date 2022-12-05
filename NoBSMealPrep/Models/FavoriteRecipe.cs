using System;
using System.Collections.Generic;

namespace NoBSMealPrep.Models;

public partial class FavoriteRecipe
{
    public int? Id { get; set; }

    public string? Label { get; set; }

    public string? Image { get; set; }

    public string? Uri { get; set; }

    public double? Calories { get; set; }

    public int? Favoritedby { get; set; }

    public virtual User? FavoritedbyNavigation { get; set; }

    public virtual ICollection<GroceryList> GroceryLists { get; } = new List<GroceryList>();
}
