using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Migrations
{
    /// <inheritdoc />
    public partial class ChangeSecretKeyToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SecretKey",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(byte[]),
                oldType: "bytea");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "7a223968-23b4-4652-z7b7-8574d048cdb9",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecretKey", "SecurityStamp" },
                values: new object[] { "4aa1d8aa-08fe-4e00-a381-50e820cb4306", "AQAAAAIAAYagAAAAEAF8b8T2ookega5sdPgofDZ9GJDjKq1k8VZbxhCJSw5QEAqgsDKUQYuKN4LVYQsrpQ==", null, "dbb6519c-60a9-4f80-ac2e-b5fd6bd5c595" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "88k76378-681a-4044-97ed-4ab612217206",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecretKey", "SecurityStamp" },
                values: new object[] { "9adee781-66d0-4243-a388-0a5351bbfa02", "AQAAAAIAAYagAAAAEEhA1Q1BISVVRIzct5auzhiHGqzIEIYcScMic8D+259YtSASAi/dGmiHimqwJwlRlg==", null, "b05be947-729c-4688-b9a4-8379b6b3c6c4" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "SecretKey",
                table: "AspNetUsers",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0],
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "7a223968-23b4-4652-z7b7-8574d048cdb9",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecretKey", "SecurityStamp" },
                values: new object[] { "0ca96550-113f-4946-b0c1-b0998632ff36", "AQAAAAIAAYagAAAAENnr/y+OXIRwhLBI4WUiJ8HW95QznZbajaocDT+YP+vSfz0/BZkVUVwOeg5jXcBHdw==", new byte[] { 183, 31, 8, 255, 134, 185, 32, 173, 204, 200, 165, 26, 13, 91, 179, 159, 20, 98, 131, 8, 48, 232, 122, 188, 21, 245, 142, 61, 164, 246, 73, 75 }, "198c6662-ce4a-427d-a1f4-6564e623a8cf" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "88k76378-681a-4044-97ed-4ab612217206",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecretKey", "SecurityStamp" },
                values: new object[] { "32cd47f8-3e24-4e55-8a7f-c2def450e98f", "AQAAAAIAAYagAAAAEC+EOz1EWIcwMqC1A3IqVsi2VjtWXCAptODjy9lg1uRAePdO1amT3AFs7Zry8aTEvg==", new byte[] { 24, 73, 59, 51, 78, 168, 168, 15, 1, 176, 120, 129, 115, 55, 7, 107, 239, 203, 21, 69, 234, 77, 180, 42, 166, 182, 1, 162, 32, 42, 20, 122 }, "063c348e-6400-4359-940b-324efd5bf88c" });
        }
    }
}
