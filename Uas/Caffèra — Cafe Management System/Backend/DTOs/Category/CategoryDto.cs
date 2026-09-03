namespace Caffera.Backend.DTOs.Category;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int TotalMenus { get; set; }
    public DateTime CreatedAt { get; set; }
}
