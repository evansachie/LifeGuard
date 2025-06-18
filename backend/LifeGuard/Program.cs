using Application.Contracts;
using DotNetEnv;
using Identity;
using Identity.Features.ResendOTP;
using Identity.Features.VerifyOTP;
using Identity.Models;
using Infrastructure.EmailService;
using Infrastructure.OTPService;
using Identity.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;
using Microsoft.OpenApi.Models;
using Persistence;
using Application.Contracts.Photos;
using Infrastructure.Photos;
using Microsoft.AspNetCore.HttpOverrides;
using LifeGuard.Services;
namespace LifeGuard
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string env = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            Console.WriteLine(Directory.GetCurrentDirectory());
            if (env == "Development")
            {
                Env.Load("../.env.local");
            }
            else
            {
                Env.Load("../.env.local");
            }
            var builder = WebApplication.CreateBuilder(args);

            
            //Add services to the container.

            var connectionStringAuth = Environment.GetEnvironmentVariable("CONNECTION_STRING_AUTH");
            var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");
            var jwt_key = Environment.GetEnvironmentVariable("JWT_KEY");
            var jwt_issuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
            var jwt_audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
            var jwt_duration_in_minutes = Environment.GetEnvironmentVariable("JWT_DURATIONINMINUTES");
            var client_id = Environment.GetEnvironmentVariable("CLIENT_ID");
            var client_secret = Environment.GetEnvironmentVariable("CLIENT_SECRET");
            var default_url = Environment.GetEnvironmentVariable("FRONTEND_URL");
            // Add services to the container.
              
            builder.Services.AddDbContext<LifeGuardIdentityDbContext>(options => 
            options.UseNpgsql(connectionStringAuth));
            builder.Services.AddDbContext<LifeGuardDbContext>(options =>
            options.UseNpgsql(connectionString));
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<LifeGuardIdentityDbContext>().AddDefaultTokenProviders();
            builder.Services.AddControllers();


            builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(Assembly.GetExecutingAssembly()));
            builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(VerifyOTPCommand).Assembly));
            builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(ResendOTPCommand).Assembly));

            builder.Services.AddTransient<IAuthService, AuthService>();
            builder.Services.AddTransient<IEmailService, EmailService>();
            builder.Services.AddTransient<IOTPService, OTPService>();
            

            builder.Services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            builder.Services.AddScoped<IUserPhotoService, UserPhotoService>();

            builder.Services.AddScoped<IReturnUrlValidator, ReturnUrlValidator>();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                
            })
                .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
                {
                    options.LoginPath = "/api/Account/login";
                })
                .AddJwtBearer(o =>
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer = jwt_issuer,
                    ValidAudience = "LifeGuardUser",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt_key))


                })
                .AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
                {
                    options.ClientId = client_id;
                    options.ClientSecret = client_secret;
                    //options.CallbackPath = "/api/Account/signin-google";
                    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.SaveTokens = true;
                    options.Scope.Add("email");
                });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme.
                                   Enter 'Bearer' [space] and then your token in the text input
                                   below.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"

                        },
                        Scheme = "oauth2",
                        Name = "Bearer",
                        In = ParameterLocation.Header,
                    },
                    new List<string>()
                    }
                });
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "LifeGuard", Version = "1.0.0" });
            }
            );

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Frontend", policy =>
                {
                    policy
                        .WithOrigins("https://lifeguard-vq69.onrender.com",
                        "https://lifeguard-vert.vercel.app",
                        "http://localhost:3000"
                        )   
                        .AllowAnyMethod()                                     
                        .AllowAnyHeader()                                     
                        .AllowCredentials();                                  
                });
            });

   
            


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }


            app.UseHttpsRedirection();

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedProto,
                RequireHeaderSymmetry = false,
                ForwardLimit = null
            });

            app.UseAuthentication();

            app.UseAuthorization();
            
            app.UseCors("Frontend");


            app.MapControllers();

            app.Run();
        }
    }
}
