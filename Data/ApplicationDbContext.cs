using IdentityServer4.EntityFramework.Options;
using Licenta.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Seed();

            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Id).ValueGeneratedNever();

            });

            modelBuilder.Entity<Aptitude>(entity =>
            {
                entity.HasKey(a => a.Id);
            });

            modelBuilder.Entity<ForeignLanguage>(entity =>
            {
                entity.HasKey(f => f.Id);

            });

            modelBuilder.Entity<Education>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Student)
                      .WithMany(s => s.Educations)
                      .HasForeignKey(e => e.IdStudent);
            });

            modelBuilder.Entity<Experience>(entity =>
            {
                entity.HasKey(s => s.Id);

                entity.HasOne(e => e.Student)
                      .WithMany(s => s.Experiences)
                      .HasForeignKey(e => e.IdStudent);
            });

            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.HasOne(p => p.Student)
                      .WithMany(s => s.Projects)
                      .HasForeignKey(p => p.IdStudent);
            });

            modelBuilder.Entity<StudentAptitude>(entity =>
            {
                entity.HasKey(sa => new { sa.IdStudent, sa.IdAptitude });

                entity.HasOne(sa => sa.Student)
                      .WithMany(s => s.StudentAptitudes)
                      .HasForeignKey(sa => sa.IdStudent);

                entity.HasOne(sa => sa.Aptitude)
                      .WithMany(a => a.StudentAptitudes)
                      .HasForeignKey(sa => sa.IdAptitude);
            });

            modelBuilder.Entity<StudentForeignLanguage>(entity =>
            {
                entity.HasKey(sf => new { sf.IdStudent, sf.IdForeignLanguage });

                entity.HasOne(sf => sf.Student)
                      .WithMany(s => s.StudentForeignLanguages)
                      .HasForeignKey(sf => sf.IdStudent);

                entity.HasOne(sf => sf.ForeignLanguage)
                      .WithMany(f => f.StudentForeignLanguages)
                      .HasForeignKey(sf => sf.IdForeignLanguage);
            });

            modelBuilder.Entity<Company>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(s => s.Id).ValueGeneratedNever();
                entity.HasIndex(c => c.Name).IsUnique();

            });

            modelBuilder.Entity<City>(entity =>
            {
                entity.HasKey(c => c.Id);
            });

            modelBuilder.Entity<Internship>(entity =>
            {
                entity.HasKey(i => i.Id);

                entity.HasOne(i => i.Company)
                      .WithMany(c => c.Internships)
                      .HasForeignKey(i => i.IdCompany);

                entity.HasOne(i => i.City)
                      .WithMany(c => c.Internships)
                      .HasForeignKey(i => i.IdCity);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);
            });

            modelBuilder.Entity<InternshipCategory>(entity =>
            {
                entity.HasKey(ic => new { ic.IdInternship, ic.IdCategory });

                entity.HasOne(ic => ic.Internship)
                      .WithMany(i => i.InternshipCategories)
                      .HasForeignKey(ic => ic.IdInternship);

                entity.HasOne(ic => ic.Category)
                      .WithMany(c => c.InternshipCategories)
                      .HasForeignKey(ic => ic.IdCategory);
            });

            modelBuilder.Entity<StudentInternship>(entity =>
            {
                entity.HasKey(si => new { si.IdStudent, si.IdInternship });

                entity.HasOne(si => si.Student)
                      .WithMany(s => s.StudentInternships)
                      .HasForeignKey(si => si.IdStudent);

                entity.HasOne(si => si.Internship)
                      .WithMany(i => i.StudentInternships)
                      .HasForeignKey(si => si.IdInternship);
            });


            modelBuilder.Entity<InternshipAptitude>(entity =>
            {
                entity.HasKey(sa => new { sa.IdInternship, sa.IdAptitude });

                entity.HasOne(sa => sa.Internship)
                      .WithMany(s => s.InternshipAptitudes)
                      .HasForeignKey(sa => sa.IdInternship);

                entity.HasOne(sa => sa.Aptitude)
                      .WithMany(a => a.InternshipAptitudes)
                      .HasForeignKey(sa => sa.IdAptitude);
            });

            modelBuilder.Entity<SavedStudentInternship>(entity =>
            {
                entity.HasKey(si => new { si.IdStudent, si.IdInternship });

                entity.HasOne(si => si.Student)
                      .WithMany(s => s.SavedStudentInternships)
                      .HasForeignKey(si => si.IdStudent);

                entity.HasOne(si => si.Internship)
                      .WithMany(i => i.SavedStudentInternships)
                      .HasForeignKey(si => si.IdInternship);
            });

            modelBuilder.Entity<StudentInternshipReview>(entity =>
            {
                entity.HasKey(si => new { si.IdStudent, si.IdInternship });

                entity.HasOne(si => si.Student)
                      .WithMany(s => s.StudentInternshipReviews)
                      .HasForeignKey(si => si.IdStudent);

                entity.HasOne(si => si.Internship)
                      .WithMany(i => i.StudentInternshipReviews)
                      .HasForeignKey(si => si.IdInternship);
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

            modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole { Name = "Student", NormalizedName = "Student".ToUpper() },
                new IdentityRole { Name = "Company", NormalizedName = "Company".ToUpper() }
            );
        }
    }
}
