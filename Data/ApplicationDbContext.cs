using Licenta.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Licenta.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Aptitude> Aptitudes { get; set; }
        public DbSet<StudentAptitude> StudentAptitudes { get; set; }
        public DbSet<StudentInternship> StudentInternships { get; set; }
        public DbSet<ForeignLanguage> ForeignLanguages { get; set; }
        public DbSet<StudentForeignLanguage> StudentForeignLanguages { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Internship> Internships { get; set; }
        public DbSet<InternshipCategory> InternshipCategories { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<InternshipAptitude> InternshipAptitudes { get; set; }
        public DbSet<SavedStudentInternship> SavedStudentInternships { get; set; }
        public DbSet<StudentInternshipReview> StudentInternshipReviews { get; set; }
        public DbSet<Faculty> Faculties { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Seed();

            modelBuilder.Entity<StudentAptitude>(entity =>
            {
                entity.HasKey(sa => new { sa.StudentId, sa.AptitudeId });

            });

            modelBuilder.Entity<StudentForeignLanguage>(entity =>
            {
                entity.HasKey(sf => new { sf.StudentId, sf.ForeignLanguageId });

            });

            modelBuilder.Entity<Company>(entity =>
            {
                entity.HasIndex(c => c.Name).IsUnique();

            });


            modelBuilder.Entity<InternshipCategory>(entity =>
            {
                entity.HasKey(ic => new { ic.InternshipId, ic.CategoryId });

            });

            modelBuilder.Entity<StudentInternship>(entity =>
            {
                entity.HasKey(si => new { si.StudentId, si.InternshipId });

            });


            modelBuilder.Entity<InternshipAptitude>(entity =>
            {
                entity.HasKey(sa => new { sa.InternshipId, sa.AptitudeId });

            });

            modelBuilder.Entity<SavedStudentInternship>(entity =>
            {
                entity.HasKey(si => new { si.StudentId, si.InternshipId });

            });

            modelBuilder.Entity<StudentInternshipReview>(entity =>
            {
                entity.HasKey(si => new { si.StudentId, si.InternshipId });

            });

        }
    }

    public static class ModelBuilderExtensions
    {
        public static void Seed(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Aptitude>().HasData(
                new Aptitude { Id = 1, Name = "c++" },
                new Aptitude { Id = 2, Name = "c" },
                new Aptitude { Id = 3, Name = "c#" }
            );

            modelBuilder.Entity<ForeignLanguage>().HasData(
                new ForeignLanguage { Id = 1, Name = "Engleza" },
                new ForeignLanguage { Id = 2, Name = "Franceza" },
                new ForeignLanguage { Id = 3, Name = "Germana" }
            );

            modelBuilder.Entity<City>().HasData(
                new City { Id = 1, Name = "Bucuresti" },
                new City { Id = 2, Name = "Timisoara" },
                new City { Id = 3, Name = "Cluj" }
            );

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Video game" },
                new Category { Id = 2, Name = "Desktop developer" },
                new Category { Id = 3, Name = "Web" },
                new Category { Id = 4, Name = "Linux" }
            );

            modelBuilder.Entity<Faculty>().HasData(
                new Faculty { Id = 1, Name = "Facultatea de Matematică-Informatică București"},
                new Faculty { Id = 2, Name = "Facultatea de Automatică și Calculatoare București" },
                new Faculty { Id = 3, Name = "Facultatea de Matematică-Informatică Cluj" },
                new Faculty { Id = 4, Name = "Facultatea de Automatică și Calculatoare Cluj" },
                new Faculty { Id = 5, Name = "Facultatea de Matematică-Informatică Timișoara" },
                new Faculty { Id = 6, Name = "Facultatea de Automatică și Calculatoare Timișoara" }
            );

        }
    }
}
