using ExamServer.Data;
using ExamServer.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<SchoolDbContext>();
builder.Services.AddTransient<ISchoolRepository<Student>, StudentRepository>();
builder.Services.AddTransient<ISchoolRepository<Subject>, SubjectRepository>();
builder.Services.AddTransient<ISchoolRepository<Grade>, GradeRepository>();

var app = builder.Build();
app.UseRouting();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapGet("/", () => "Hello World!");

app.Run();
