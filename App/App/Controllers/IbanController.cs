using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IbanController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public IbanController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Operator,OperatorRaion")]
    public async Task<IActionResult> GetAll([FromQuery] string? raion = null, [FromQuery] string? localitate = null, [FromQuery] string? codEco = null, [FromQuery] int? year = null)
    {
        var userRole = User.FindFirst("role")?.Value;
        var userRaion = User.FindFirst("Raion")?.Value;

        IQueryable<Iban> query = _context.Ibans;

        if (userRole == "OperatorRaion")
        {
            query = query.Where(i => i.Raion == userRaion);
        }
        else
        {
            if (!string.IsNullOrEmpty(raion))
                query = query.Where(i => i.Raion == raion);

            if (!string.IsNullOrEmpty(localitate))
                query = query.Where(i => i.Localitate == localitate);

            if (!string.IsNullOrEmpty(codEco))
                query = query.Where(i => i.CodEco == codEco);

            if (year.HasValue)
                query = query.Where(i => i.Year == year.Value);
        }

        var result = await query.ToListAsync();
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Operator")]
    public async Task<IActionResult> Create([FromBody] Iban iban)
    {
        if (await _context.Ibans.AnyAsync(i => i.IbanCode == iban.IbanCode))
            return BadRequest("IBAN deja existent.");

        _context.Ibans.Add(iban);
        await _context.SaveChangesAsync();
        return Ok("IBAN adăugat.");
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Operator")]
    public async Task<IActionResult> Update(int id, [FromBody] Iban iban)
    {
        var existing = await _context.Ibans.FindAsync(id);
        if (existing == null) return NotFound();

        existing.IbanCode = iban.IbanCode;
        existing.Year = iban.Year;
        existing.CodEco = iban.CodEco;
        existing.Raion = iban.Raion;
        existing.Localitate = iban.Localitate;

        await _context.SaveChangesAsync();
        return Ok("IBAN actualizat.");
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var iban = await _context.Ibans.FindAsync(id);
        if (iban == null) return NotFound();

        _context.Ibans.Remove(iban);
        await _context.SaveChangesAsync();
        return Ok("IBAN șters.");
    }

    [HttpGet("paginated")]
    [Authorize(Roles = "Admin,Operator,OperatorRaion")]
    public async Task<IActionResult> GetPaginated(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? raion = null,
        [FromQuery] string? localitate = null,
        [FromQuery] string? codEco = null,
        [FromQuery] string? year = null,
        [FromQuery] string? sortField = "id",
        [FromQuery] string? sortOrder = "asc")
    {
        var userRole = User.FindFirst("role")?.Value;
        var userRaion = User.FindFirst("Raion")?.Value;

        IQueryable<Iban> query = _context.Ibans;

        if (userRole == "OperatorRaion" && !string.IsNullOrEmpty(userRaion))
            query = query.Where(i => i.Raion == userRaion);

        if (!string.IsNullOrWhiteSpace(raion))
            query = query.Where(i => i.Raion.Contains(raion));
        if (!string.IsNullOrWhiteSpace(localitate))
            query = query.Where(i => i.Localitate.Contains(localitate));
        if (!string.IsNullOrWhiteSpace(codEco))
            query = query.Where(i => i.CodEco.Contains(codEco));
        if (int.TryParse(year, out int y))
            query = query.Where(i => i.Year == y);

        query = (sortField?.ToLower(), sortOrder?.ToLower()) switch
        {
            ("ibancode", "desc") => query.OrderByDescending(i => i.IbanCode),
            ("ibancode", _) => query.OrderBy(i => i.IbanCode),

            ("year", "desc") => query.OrderByDescending(i => i.Year),
            ("year", _) => query.OrderBy(i => i.Year),

            ("codeco", "desc") => query.OrderByDescending(i => i.CodEco),
            ("codeco", _) => query.OrderBy(i => i.CodEco),

            ("raion", "desc") => query.OrderByDescending(i => i.Raion),
            ("raion", _) => query.OrderBy(i => i.Raion),

            ("localitate", "desc") => query.OrderByDescending(i => i.Localitate),
            ("localitate", _) => query.OrderBy(i => i.Localitate),

            ("id", "desc") => query.OrderByDescending(i => i.Id),
            _ => query.OrderBy(i => i.Id),
        };

        var totalCount = await query.CountAsync();

        if (totalCount == 0 || (page - 1) * pageSize >= totalCount)
        {
            return Ok(new { items = new List<Iban>(), totalCount });
        }

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { items, totalCount });
    }

}
