using Licenta.Data;
using Licenta.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


namespace Licenta.Repositories
{
    public class InternshipsRepository : IInternshipsRepository
    {
        private readonly ApplicationDbContext _context;
        public InternshipsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Internship>> GetAllInternshipsAsync()
        {
            return await _context.Internships.ToListAsync();
        }

        public async Task<IEnumerable<Internship>> GetInternshipsByCompanyId(int companyId)
        {
            return await _context.Internships
                                .Where(i => i.CompanyId.Equals(companyId))
                                .ToListAsync();
        }

        public async Task<IEnumerable<Internship>> GetInternshipsByCompanyIdAndStatus(int companyId, string status)
        {
            return await _context.Internships
                                .Where(i => i.CompanyId.Equals(companyId) && (i.Status == status || status == "all"))
                                .ToListAsync();
        }

        public async Task<IEnumerable<Internship>> GetInternshipsBySearchCityName(string searchString, string city)
        {
            
            if (string.IsNullOrEmpty(searchString) && string.IsNullOrEmpty(city))
            {
                return await _context.Internships
                                     .Where(i => i.Status == "approved").ToListAsync();
            }
            else
            {
                List<Internship> result = new List<Internship>();
                if (!string.IsNullOrEmpty(searchString))
                    searchString = searchString.ToLower();
                if (!string.IsNullOrEmpty(city))
                    city = city.ToLower();

                List<Internship> internships = await _context.Internships
                                        .Include(i => i.InternshipCategories)
                                            .ThenInclude(ic => ic.Category)
                                        .Include(i => i.InternshipAptitudes)
                                            .ThenInclude(ia => ia.Aptitude)
                                        .Include(i => i.City)
                                        .Include(i => i.Company)
                                        .ToListAsync();

                foreach (Internship internship in internships)
                {
                    if (internship.Status == "approved")
                    {
                        bool foundSearchString = false;
                        bool foundCity = false;
                        if (!string.IsNullOrEmpty(searchString))
                        {
                            if (!string.IsNullOrEmpty(internship.Name) &&
                                (internship.Name.ToLower().Contains(searchString) || searchString.Contains(internship.Name.ToLower())))
                            {
                                foundSearchString = true;
                            }


                            if (!string.IsNullOrEmpty(internship.Company.Name) &&
                                (internship.Company.Name.ToLower().Contains(searchString) || searchString.Contains(internship.Company.Name.ToLower())))
                            {
                                foundSearchString = true;
                            }

                            if (!string.IsNullOrEmpty(internship.City.Name) &&
                                (internship.City.Name.ToLower().Contains(searchString) || searchString.Contains(internship.City.Name.ToLower())))
                            {
                                foundSearchString = true;
                            }


                            InternshipCategory foundInternshipCategory = internship.InternshipCategories
                                .FirstOrDefault(ic => ic.Category.Name.ToLower().Contains(searchString) || searchString.Contains(ic.Category.Name.ToLower()));
                            if (foundInternshipCategory != null)
                            {
                                foundSearchString = true;
                            }

                            InternshipAptitude foundInternshipAptitude = internship.InternshipAptitudes
                                .FirstOrDefault(ia => ia.Aptitude.Name.ToLower().Contains(searchString) || searchString.Contains(ia.Aptitude.Name.ToLower()));
                            if (foundInternshipAptitude != null)
                            {
                                foundSearchString = true;
                            }
                        }
                        else
                        {
                            foundSearchString = true;
                        }

                        if (!string.IsNullOrEmpty(city))
                        {
                            if (!string.IsNullOrEmpty(internship.City.Name) &&
                                (internship.City.Name.ToLower().Contains(city) || city.Contains(internship.City.Name.ToLower())))
                            {
                                foundCity = true;
                            }
                        }
                        else
                        {
                            foundCity = true;
                        }

                        if (foundSearchString && foundCity)
                            result.Add(internship);
                    }
                    
                }

                return result;
            }

        }

        public async Task<IEnumerable<Internship>> GetInternshipsByCategoryId(int categoryId)
        {
            return await _context.Internships
                    .Include(i => i.InternshipCategories)
                    .Where(i => i.InternshipCategories.Any(ic => ic.CategoryId == categoryId))
                    .ToListAsync();
        }

        public async Task<IEnumerable<Internship>> GetInternshipsByCityId(int cityId)
        {
            return await _context.Internships
                                .Where(i => i.CityId == cityId)
                                .ToListAsync();    
        }

        public async Task<IEnumerable<Internship>> GetInternshipsByStudentId(int studentId)
        {
            List<Internship> internships = new List<Internship>();

            return await _context.Internships.Include(i => i.StudentInternships)
                                             .Where(i => i.StudentInternships.Any(ic => ic.StudentId == studentId))
                                             .ToListAsync();
        }

        public async Task<IEnumerable<Internship>> GetInternshipsByStudentIdSaved(int studentId)
        {
            List<Internship> internships = new List<Internship>();

            return await _context.Internships.Include(i => i.SavedStudentInternships)
                                             .Where(i => i.SavedStudentInternships.Any(ic => ic.StudentId == studentId))
                                             .ToListAsync();

        }

        public async Task<Internship> GetInternshipById(int internshipId)
        {
           return await _context.Internships
                                    .FirstOrDefaultAsync(i => i.Id == internshipId);

        }

        public async Task CreateInternship(Internship internship)
        {
            _context.Internships.Add(internship);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateInternship(Internship internship)
        {
            _context.Internships.Update(internship);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteInternship(Internship internship)
        {
            _context.Internships.Remove(internship);
            await _context.SaveChangesAsync();
        }

    }
}
