namespace Caffera.Backend.DTOs.Table;

public class TableDto
{
    public int Id { get; set; }
    public int Number { get; set; }
    public int Capacity { get; set; }
    public string Status { get; set; } = "Available";
    public DateTime CreatedAt { get; set; }
}
