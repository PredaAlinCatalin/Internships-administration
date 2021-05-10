using Licenta.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Repositories
{
    public interface IInternshipsRepository
    {
        Task<IEnumerable<Internship>> GetInternshipsByCompanyId(int companyId);
        Task<IEnumerable<Internship>> GetAllInternshipsAsync();
        Task<IEnumerable<Internship>> GetInternshipsBySearchCityName(string searchString, string city);
        Task<IEnumerable<Internship>> GetInternshipsByCategoryId(int categoryId);
        Task<IEnumerable<Internship>> GetInternshipsByCityId(int cityId);
        Task<IEnumerable<Internship>> GetInternshipsByStudentId(int studentId);
        Task<IEnumerable<Internship>> GetInternshipsByStudentIdSaved(int studentId);
        Task<Internship> GetInternshipById(int internshipId);
        Task CreateInternship(Internship internship);
        Task UpdateInternship(Internship internship);
        Task DeleteInternship(Internship internship);
    }
}
