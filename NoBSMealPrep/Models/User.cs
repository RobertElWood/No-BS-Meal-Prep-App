using System;
using System.Collections.Generic;

namespace NoBSMealPrep.Models;

public partial class User
{
    public int Id { get; set; }

    public string? Username { get; set; }

    public string? Logininfo { get; set; }

    public virtual ICollection<FavoriteRecipe> FavoriteRecipes { get; } = new List<FavoriteRecipe>();
}
