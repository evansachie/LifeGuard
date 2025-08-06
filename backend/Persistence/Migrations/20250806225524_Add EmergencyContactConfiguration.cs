using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddEmergencyContactConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Relationship",
                table: "EmergencyContacts",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.InsertData(
                table: "EmergencyContacts",
                columns: new[] { "Id", "CreatedAt", "Email", "Name", "Phone", "Relationship", "UpDatedAt", "UserId" },
                values: new object[] { 1, new DateTime(2025, 8, 6, 22, 55, 23, 629, DateTimeKind.Utc).AddTicks(197), "info@moh.gov.gh", "Ambulance Service", "0505982870", null, new DateTime(2025, 8, 6, 22, 55, 23, 629, DateTimeKind.Utc).AddTicks(198), "8ce70e67-d519-4a44-8219-2c164c4bf10b" });

            migrationBuilder.UpdateData(
                table: "Memos",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpDatedAt" },
                values: new object[] { new DateTime(2025, 8, 6, 22, 55, 23, 628, DateTimeKind.Utc).AddTicks(9361), new DateTime(2025, 8, 6, 22, 55, 23, 628, DateTimeKind.Utc).AddTicks(9371) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "EmergencyContacts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.AlterColumn<string>(
                name: "Relationship",
                table: "EmergencyContacts",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Memos",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpDatedAt" },
                values: new object[] { new DateTime(2025, 2, 24, 17, 16, 22, 183, DateTimeKind.Utc).AddTicks(8329), new DateTime(2025, 2, 24, 17, 16, 22, 183, DateTimeKind.Utc).AddTicks(8331) });
        }
    }
}
