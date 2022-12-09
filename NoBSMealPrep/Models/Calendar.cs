using System;
using System.Collections.Generic;

namespace NoBSMealPrep.Models;

public partial class Calendar
{
    public int Id { get; set; }

    public string? Label { get; set; }

    public string? Day { get; set; }

    public string? Meal { get; set; }

    public int? UserInfo { get; set; }

    public virtual User? UserInfoNavigation { get; set; }
}
