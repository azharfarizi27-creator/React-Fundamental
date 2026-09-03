using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Dashboard;

namespace Caffera.Backend.Services.Interfaces;

public interface IDashboardService
{
    Task<ApiResponse<DashboardStatsDto>> GetDashboardStatsAsync();
}
