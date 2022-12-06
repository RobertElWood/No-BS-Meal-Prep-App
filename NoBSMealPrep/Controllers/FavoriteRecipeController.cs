using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NoBSMealPrep.Models;

namespace NoBSMealPrep.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteRecipeController : ControllerBase
    {
        private readonly MealPrepDbContext _context;

        public FavoriteRecipeController(MealPrepDbContext context)
        {
            _context = context;
        }

        // GET: api/FavoriteRecipe
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FavoriteRecipe>>> GetFavoriteRecipes()
        {
            return await _context.FavoriteRecipes.ToListAsync();
        }


        /*[HttpGet] {{old}}
        public async Task<ActionResult<IEnumerable<FavoriteRecipe>>> GetFavoriteRecipes(int favoritedBy)
        {

            List<FavoriteRecipe> favRecipes = await _context.FavoriteRecipes.ToListAsync();
            return favRecipes.Where(f => f.Favoritedby == favoritedBy).ToList();

        }*/


        // GET: api/FavoriteRecipe/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FavoriteRecipe>> GetFavoriteRecipe(int id)
        {
            var favoriteRecipe = await _context.FavoriteRecipes.FindAsync(id);

            if (favoriteRecipe == null)
            {
                return NotFound();
            }

            return favoriteRecipe;
        }

/*        // GET: api/FavoriteRecipe/favoritedBy
        [HttpGet("{favoritedBy}")] {{old}}
        public async Task<ActionResult<IEnumerable<FavoriteRecipe>>> GetFavoriteRecipesByUser(int favoritedBy)
        {
            List<FavoriteRecipe> favRecipes = await _context.FavoriteRecipes.ToListAsync();
            return favRecipes.Where(f => f.Favoritedby == favoritedBy).ToList();
 
        }*/

        // PUT: api/FavoriteRecipe/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFavoriteRecipe(int id, FavoriteRecipe favoriteRecipe)
        {
            if (id != favoriteRecipe.Id)
            {
                return BadRequest();
            }

            _context.Entry(favoriteRecipe).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FavoriteRecipeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/FavoriteRecipe
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FavoriteRecipe>> PostFavoriteRecipe(FavoriteRecipe favoriteRecipe)
        {
            favoriteRecipe.Id = null;
            _context.FavoriteRecipes.Add(favoriteRecipe);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFavoriteRecipe", new { id = favoriteRecipe.Id }, favoriteRecipe);
        }

        //edit post method to include a check for the URI. This should allow you to check and see if the recipe has been posted previously.

        // DELETE: api/FavoriteRecipe/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFavoriteRecipe(int id)
        {
            var favoriteRecipe = await _context.FavoriteRecipes.FindAsync(id);
            if (favoriteRecipe == null)
            {
                return NotFound();
            }

            _context.FavoriteRecipes.Remove(favoriteRecipe);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FavoriteRecipeExists(int id)
        {
            return _context.FavoriteRecipes.Any(e => e.Id == id);
        }
    }
}
