using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Migrations
{
    /// <inheritdoc />
    public partial class Second_Migrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "7a223968-23b4-4652-z7b7-8574d048cdb9",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecretKey", "SecurityStamp" },
                values: new object[] { "ed11e352-ee1b-4482-a038-b838cbad2072", "AQAAAAIAAYagAAAAEITjqbfWYZlf+pflnyK1C3Uubx0YvvRWDodwk1bWT02LkXq8XGkvhGjOF56Y1mVSdQ==", new byte[] { 218, 225, 2, 6, 241, 53, 139, 161, 128, 66, 137, 224, 122, 12, 196, 205, 228, 66, 32, 80, 76, 151, 222, 104, 77, 109, 120, 23, 228, 70, 88, 108 }, "ce696e84-1ea8-4dc1-a502-56588df4afba" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "88k76378-681a-4044-97ed-4ab612217206",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecretKey", "SecurityStamp" },
                values: new object[] { "748ce8f0-97c0-426a-8d93-06484a947486", "AQAAAAIAAYagAAAAEJ7qHZ6648GtJ8gD6Wz3kigbpQS6a5RuNrlp/AM3OBrMMEnPK5n7/oHCtgaiM8o0mQ==", new byte[] { 208, 111, 218, 12, 44, 75, 80, 171, 107, 210, 73, 95, 249, 115, 149, 127, 19, 18, 58, 135, 246, 209, 148, 96, 39, 178, 235, 6, 106, 22, 249, 151 }, "9dba8bb5-c4cc-4ca1-b2aa-08d463726f45" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
