using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Reports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApplicationUser",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Age = table.Column<int>(type: "integer", nullable: true),
                    Gender = table.Column<string>(type: "text", nullable: true),
                    Weight = table.Column<int>(type: "integer", nullable: true),
                    Height = table.Column<int>(type: "integer", nullable: true),
                    Bio = table.Column<string>(type: "text", nullable: true),
                    SecretKey = table.Column<string>(type: "text", nullable: true),
                    PhotoUrl = table.Column<string>(type: "text", nullable: true),
                    PhotoPublicId = table.Column<string>(type: "text", nullable: true),
                    UserName = table.Column<string>(type: "text", nullable: true),
                    NormalizedUserName = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    NormalizedEmail = table.Column<string>(type: "text", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUser", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HealthReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DeviceId = table.Column<string>(type: "text", nullable: false),
                    ReportDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReportPeriod = table.Column<string>(type: "text", nullable: false),
                    TotalSteps = table.Column<int>(type: "integer", nullable: false),
                    AvgAmbientTemp = table.Column<double>(type: "double precision", nullable: false),
                    AvgHumidity = table.Column<double>(type: "double precision", nullable: false),
                    AvgAirQualityIndex = table.Column<int>(type: "integer", nullable: false),
                    Avgco2 = table.Column<int>(type: "integer", nullable: false),
                    Avgvoc = table.Column<int>(type: "integer", nullable: false),
                    Avgpm25 = table.Column<int>(type: "integer", nullable: false),
                    Avgpm10 = table.Column<int>(type: "integer", nullable: false),
                    Minaqi = table.Column<int>(type: "integer", nullable: false),
                    Maxaqi = table.Column<int>(type: "integer", nullable: false),
                    FallCount = table.Column<int>(type: "integer", nullable: false),
                    AvgDailySteps = table.Column<double>(type: "double precision", nullable: false),
                    AvgPressure = table.Column<double>(type: "double precision", nullable: false),
                    LastUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    DataPointCount = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpDatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthReports_ApplicationUser_UserId",
                        column: x => x.UserId,
                        principalTable: "ApplicationUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "EmergencyContacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpDatedAt", "UserId" },
                values: new object[] { new DateTime(2025, 9, 21, 15, 39, 57, 452, DateTimeKind.Utc).AddTicks(8083), new DateTime(2025, 9, 21, 15, 39, 57, 452, DateTimeKind.Utc).AddTicks(8083), "e52c4b58-24d6-4f5d-a634-ecb37d956f8d" });

            migrationBuilder.UpdateData(
                table: "Memos",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpDatedAt" },
                values: new object[] { new DateTime(2025, 9, 21, 15, 39, 57, 452, DateTimeKind.Utc).AddTicks(7929), new DateTime(2025, 9, 21, 15, 39, 57, 452, DateTimeKind.Utc).AddTicks(7932) });

            migrationBuilder.CreateIndex(
                name: "IX_HealthReports_UserId",
                table: "HealthReports",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HealthReports");

            migrationBuilder.DropTable(
                name: "ApplicationUser");

            migrationBuilder.UpdateData(
                table: "EmergencyContacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpDatedAt", "UserId" },
                values: new object[] { new DateTime(2025, 8, 6, 22, 55, 23, 629, DateTimeKind.Utc).AddTicks(197), new DateTime(2025, 8, 6, 22, 55, 23, 629, DateTimeKind.Utc).AddTicks(198), "8ce70e67-d519-4a44-8219-2c164c4bf10b" });

            migrationBuilder.UpdateData(
                table: "Memos",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpDatedAt" },
                values: new object[] { new DateTime(2025, 8, 6, 22, 55, 23, 628, DateTimeKind.Utc).AddTicks(9361), new DateTime(2025, 8, 6, 22, 55, 23, 628, DateTimeKind.Utc).AddTicks(9371) });
        }
    }
}
