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

    public virtual DbSet<FavoriteRecipe> FavoriteRecipes { get; set; }

    public virtual DbSet<GroceryList> GroceryLists { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.\\SQLExpress;Database=MealPrepDB;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FavoriteRecipe>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Favorite__3214EC07384DE480");

            entity.Property(e => e.Image).HasMaxLength(100);
            entity.Property(e => e.Label).HasMaxLength(75);
            entity.Property(e => e.Uri)
                .HasMaxLength(100)
                .HasColumnName("URI");

            entity.HasOne(d => d.FavoritedbyNavigation).WithMany(p => p.FavoriteRecipes)
                .HasForeignKey(d => d.Favoritedby)
                .HasConstraintName("FK__FavoriteR__Favor__3B75D760");
        });

        modelBuilder.Entity<GroceryList>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__GroceryL__3214EC072DB26083");

            entity.ToTable("GroceryList");

            entity.Property(e => e.Food).HasMaxLength(50);
            entity.Property(e => e.Measure).HasMaxLength(30);

            entity.HasOne(d => d.ParentRecipeNavigation).WithMany(p => p.GroceryLists)
                .HasForeignKey(d => d.ParentRecipe)
                .HasConstraintName("FK__GroceryLi__Paren__38996AB5");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07C819EEC4");

            entity.Property(e => e.Logininfo).HasMaxLength(75);
            entity.Property(e => e.Username).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
