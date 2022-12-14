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
    public class GroceryListController : ControllerBase
    {
        private readonly MealPrepDbContext _context;

        public GroceryListController(MealPrepDbContext context)
        {
            _context = context;
        }

        // GET: api/GroceryList
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroceryList>>> GetGroceryLists()
        {
            List<GroceryList> GlUnsorted = await _context.GroceryLists.ToListAsync();

            List<GroceryList> GlSorted = GlUnsorted.OrderBy(g => g.FoodCategory).ToList();

            return GlSorted;
        }

        // GET: api/GroceryList/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GroceryList>> GetGroceryList(int id)
        {
            var groceryList = await _context.GroceryLists.FindAsync(id);

            if (groceryList == null)
            {
                return NotFound();
            }

            return groceryList;
        }

        // PUT: api/GroceryList/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGroceryList(int id, GroceryList groceryList)
        {
            if (id != groceryList.Id)
            {
                return BadRequest();
            }

            _context.Entry(groceryList).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GroceryListExists(id))
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

        // POST: api/GroceryList
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<GroceryList>> PostGroceryList(GroceryList groceryList)
        {

            var existingEntry = await _context.GroceryLists.Where(g => g.Food == groceryList.Food &&
            g.Quantity == groceryList.Quantity &&
            g.Measure == groceryList.Measure &&
            g.FoodCategory == groceryList.FoodCategory &&
            g.ParentRecipe == groceryList.ParentRecipe).FirstOrDefaultAsync();

            if (existingEntry != null){
                existingEntry.Food = "This is a duplicate value";
                return existingEntry;
            }
            else{
                _context.GroceryLists.Add(groceryList);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetGroceryList", new { id = groceryList.Id }, groceryList);
            }
        }

        // DELETE: api/GroceryList/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroceryList(int id)
        {
            var groceryList = await _context.GroceryLists.FindAsync(id);
            if (groceryList == null)
            {
                return NotFound();
            }

            _context.GroceryLists.Remove(groceryList);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GroceryListExists(int id)
        {
            return _context.GroceryLists.Any(e => e.Id == id);
        }
    }
}
