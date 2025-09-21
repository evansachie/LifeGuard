using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ReportsAdding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HealthReports_ApplicationUser_UserId",
                table: "HealthReports");

            migrationBuilder.DropTable(
                name: "ApplicationUser");

            migrationBuilder.DropIndex(
                name: "IX_HealthReports_UserId",
                table: "HealthReports");

            migrationBuilder.UpdateData(
                table: "EmergencyContacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpDatedAt", "UserId" },
                values: new object[] { new DateTime(2025, 9, 21, 16, 8, 55, 34, DateTimeKind.Utc).AddTicks(4918), new DateTime(2025, 9, 21, 16, 8, 55, 34, DateTimeKind.Utc).AddTicks(4918), "03f9a363-b1bb-4273-9b86-25772c96131f" });

            migrationBuilder.UpdateData(
                table: "Memos",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpDatedAt" },
                values: new object[] { new DateTime(2025, 9, 21, 16, 8, 55, 34, DateTimeKind.Utc).AddTicks(4732), new DateTime(2025, 9, 21, 16, 8, 55, 34, DateTimeKind.Utc).AddTicks(4734) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApplicationUser",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false),
                    Age = table.Column<int>(type: "integer", nullable: true),
                    Bio = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: true),
                    Height = table.Column<int>(type: "integer", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    NormalizedEmail = table.Column<string>(type: "text", nullable: true),
                    NormalizedUserName = table.Column<string>(type: "text", nullable: true),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PhotoPublicId = table.Column<string>(type: "text", nullable: true),
                    PhotoUrl = table.Column<string>(type: "text", nullable: true),
                    SecretKey = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    UserName = table.Column<string>(type: "text", nullable: true),
                    Weight = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUser", x => x.Id);
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

            migrationBuilder.AddForeignKey(
                name: "FK_HealthReports_ApplicationUser_UserId",
                table: "HealthReports",
                column: "UserId",
                principalTable: "ApplicationUser",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
