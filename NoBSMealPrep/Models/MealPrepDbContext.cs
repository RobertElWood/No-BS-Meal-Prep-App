using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace NoBSMealPrep.Models;

public partial class MealPrepDbContext : DbContext
{
    public MealPrepDbContext()
    {
    }

    public MealPrepDbContext(DbContextOptions<MealPrepDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Calendar> Calendars { get; set; }

    public virtual DbSet<FavoriteRecipe> FavoriteRecipes { get; set; }

    public virtual DbSet<GroceryList> GroceryLists { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        //=> optionsBuilder.UseSqlServer("Server=.\\SQLExpress;Database=MealPrepDB;Trusted_Connection=True;TrustServerCertificate=True");
        => optionsBuilder.UseSqlServer($"Server=tcp:mealprepdb.database.windows.net,1433;Initial Catalog=MealPrepDB;Persist Security Info=False;User ID={Secret.adminLogin};Password={Secret.password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Calendar>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Calendar__3213E83F8E97F98A");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Day).HasMaxLength(15);
            entity.Property(e => e.Label).HasMaxLength(500);
            entity.Property(e => e.Meal).HasMaxLength(15);

            entity.HasOne(d => d.UserInfoNavigation).WithMany(p => p.Calendars)
                .HasForeignKey(d => d.UserInfo)
                .HasConstraintName("FK__Calendars__UserI__6FE99F9F");
        });

        modelBuilder.Entity<FavoriteRecipe>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Favorite__3214EC079F8648F7");

            entity.Property(e => e.Image).HasMaxLength(4000);
            entity.Property(e => e.Label).HasMaxLength(75);
            entity.Property(e => e.Uri)
                .HasMaxLength(500)
                .HasColumnName("URI");

            entity.HasOne(d => d.FavoritedbyNavigation).WithMany(p => p.FavoriteRecipes)
                .HasForeignKey(d => d.Favoritedby)
                .HasConstraintName("FK__FavoriteR__Favor__3B75D760");
        });

        modelBuilder.Entity<GroceryList>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__GroceryL__3214EC0765801989");

            entity.ToTable("GroceryList");

            entity.Property(e => e.Food).HasMaxLength(50);
            entity.Property(e => e.FoodCategory)
                .HasMaxLength(200)
                .HasColumnName("foodCategory");
            entity.Property(e => e.Measure).HasMaxLength(30);

            entity.HasOne(d => d.ParentRecipeNavigation).WithMany(p => p.GroceryLists)
                .HasForeignKey(d => d.ParentRecipe)
                .HasConstraintName("FK__GroceryLi__Paren__38996AB5");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07CC63CE61");

            entity.Property(e => e.Logininfo).HasMaxLength(75);
            entity.Property(e => e.Username).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
