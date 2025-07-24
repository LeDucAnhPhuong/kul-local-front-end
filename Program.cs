using kul_local_back_end.Data;
using kul_local_back_end.models;
using kul_local_back_end.Repositories;
using kul_local_back_end.Repository;
using kul_locall_back_end;
using kul_locall_back_end.repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

// Register JWT Authentication
builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = jwtSettings.Issuer;
        //options.Audience = jwtSettings.Audience;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("JWT failed: " + context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine(" JWT validated successfully");
                return Task.CompletedTask;
            },
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();


builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
    );
});

var mongoUrl = new MongoUrl(builder.Configuration.GetConnectionString("DbConnection"));
var client = new MongoClient(mongoUrl);
var database = client.GetDatabase(mongoUrl.DatabaseName);

builder.Services.AddScoped<IFileRepository, FileRepository>();

builder.Services.AddHostedService<AttendanceAutoAbsentService>();

builder.Services.AddSingleton<IMongoDatabase>(database);
builder.Services.AddLogging();



// 3. Đăng ký repository
builder.Services.AddSingleton<IUserRepository, UsersRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    return new UsersRepository(db, "users"); // "users" là tên collection
});

builder.Services.AddSingleton<ISlot, SlotRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    return new SlotRepository(db, "slots"); // "users" là tên collection
});

builder.Services.AddSingleton<IRoom, RoomRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    return new RoomRepository(db, "rooms"); // "users" là tên collection
});

builder.Services.AddSingleton<IClass, ClassRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    var usersRepository = sp.GetRequiredService<IUserRepository>() as UsersRepository; // Cast để sử dụng trong ClassRepository
    return new ClassRepository(db, "class", usersRepository); // "users" là tên collection
});

builder.Services.AddSingleton<ISchedule, ScheduleRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    var usersRepository = sp.GetRequiredService<IUserRepository>() as UsersRepository;
    var classRepository = sp.GetRequiredService<IClass>() as ClassRepository; // Cast để sử dụng trong ScheduleRepository
    return new ScheduleRepository(db, "schedule", usersRepository, classRepository); // "users" là tên collection
});

builder.Services.AddSingleton<IAttendance, AttendanceRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    var scheduleRepository = sp.GetRequiredService<ISchedule>() as ScheduleRepository; // Cast để sử dụng trong AttendanceRepository
    var classRepository = sp.GetRequiredService<IClass>() as ClassRepository; // Cast để sử dụng trong AttendanceRepository
    var usersRepository = sp.GetRequiredService<IUserRepository>() as UsersRepository; // Cast để sử dụng trong AttendanceRepository
    return new AttendanceRepository(db, "attendance", scheduleRepository, classRepository, usersRepository);
});

builder.Services.AddSingleton<IRegister, RegisterRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    var scheduleRepository = sp.GetRequiredService<ISchedule>() as ScheduleRepository; // Cast để sử dụng trong RegisterRepository
    return new RegisterRepository(db, "register", scheduleRepository);
});

builder.Services.AddSingleton<IQuizRepository, QuizRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    var userRepository = sp.GetRequiredService<IUserRepository>() as UsersRepository; // Cast để sử dụng trong QuizRepository
    var scheduleRepository = sp.GetRequiredService<ISchedule>() as ScheduleRepository; // Cast để sử dụng trong RegisterRepository
    return new QuizRepository(db, "quiz", userRepository, scheduleRepository);
});
builder.Services.AddSingleton<IQuestionRepository, QuestionRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    var QuizRepository = sp.GetRequiredService<IQuizRepository>() as QuizRepository; // Cast để sử dụng trong QuestionRepository
    return new QuestionRepository(db, "question", QuizRepository);
});

builder.Services.AddSingleton<IQuizResultRepository, QuizResultRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    var usersRepository = sp.GetRequiredService<IUserRepository>() as UsersRepository;
    var questionRepository = sp.GetRequiredService<IQuestionRepository>() as QuestionRepository;
    var quizRepository = sp.GetRequiredService<IQuizRepository>() as QuizRepository;
    var logger = sp.GetRequiredService<ILogger<QuizResultRepository>>();
    return new QuizResultRepository(
        db,
        "quizResults",
        usersRepository,
        questionRepository,
        quizRepository,
        logger
    );
});

builder.Services.AddSingleton<INewsRepository, NewsRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    var usersRepository = sp.GetRequiredService<IUserRepository>() as UsersRepository; // Cast để sử dụng trong NewsRepository
    return new NewsRepository(db, "news", usersRepository); 
});
builder.Services.AddSingleton<INewsResultRepository, NewsResultRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    var usersRepository = sp.GetRequiredService<IUserRepository>() as UsersRepository; // Cast để sử dụng trong NewsRepository
    var newsRepository = sp.GetRequiredService<INewsRepository>() as NewsRepository; // Cast để sử dụng trong NewsRepository
    return new NewsResultRepository(db,newsRepository, usersRepository); 
});
builder.Services.AddSingleton<IAssignmentRepository, AssignmentRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    var usersRepository = sp.GetRequiredService<IUserRepository>() as UsersRepository; // Cast để sử dụng trong NewsRepository
    return new AssignmentRepository(db, usersRepository); 
});

builder.Services.AddSingleton<IAssignmentSubmissionRepository, AssignmentSubmissionRepository>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    var usersRepository = sp.GetRequiredService<IUserRepository>() as UsersRepository; // Cast để sử dụng trong NewsRepository
    var assignmentRepository = sp.GetRequiredService<IAssignmentRepository>() as AssignmentRepository; // Cast để sử dụng trong NewsRepository
    return new AssignmentSubmissionRepository(db, usersRepository , assignmentRepository);
});
builder.Services.AddScoped<IAcademicRepository, AcademicRepository>(sq=>
{
    var db = sq.GetRequiredService<IMongoDatabase>();
    var usersRepository = sq.GetRequiredService<IUserRepository>() as UsersRepository; // Cast để sử dụng trong AcademicRepository
    var attendanceRepository = sq.GetRequiredService<IAttendance>() as AttendanceRepository; // Cast để sử dụng trong AcademicRepository
    var registerRepository = sq.GetRequiredService<IRegister>() as RegisterRepository; // Cast để sử dụng trong AcademicRepository
    return new AcademicRepository(db, usersRepository, attendanceRepository, registerRepository);
});

builder.Services.AddScoped<ISpeakingRepository, SpeakingRepository>(sq =>
{
    var db = sq.GetRequiredService<IMongoDatabase>();
    var usersRepository = sq.GetRequiredService<IUserRepository>() as UsersRepository; // Cast để sử dụng trong SpeakingRepository
    return new SpeakingRepository(db, usersRepository); // "speaking" là tên collection
});


// 4. Clerk API
builder.Services.AddScoped<IClerkWebhookService, ClerkWebhookService>();
builder.Services.AddHttpClient<IClerkApiClient, ClerkApiClient>();

// Controllers, Swagger

builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "JWT Authorization header using the Bearer scheme.",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
        }
    );

    c.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer",
                    },
                },
                Array.Empty<string>()
            },
        }
    );
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.Use(
    async (context, next) =>
    {
        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
        Console.WriteLine($"Authorization header: {authHeader}");
        await next();
    }
);

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();
app.MapControllers();

var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Uploads")),
    RequestPath = "/uploads"
});

app.Run();
