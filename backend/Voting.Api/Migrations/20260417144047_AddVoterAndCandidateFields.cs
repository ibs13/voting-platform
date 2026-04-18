using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Voting.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddVoterAndCandidateFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Batch",
                table: "Voters");

            migrationBuilder.DropColumn(
                name: "Roll",
                table: "Voters");

            migrationBuilder.DropColumn(
                name: "Batch",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Roll",
                table: "Candidates");

            migrationBuilder.RenameColumn(
                name: "CreateAt",
                table: "AdminUsers",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Voters",
                type: "TEXT",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Session",
                table: "Voters",
                type: "TEXT",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Office",
                table: "Candidates",
                type: "TEXT",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<string>(
                name: "Session",
                table: "Candidates",
                type: "TEXT",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Voters");

            migrationBuilder.DropColumn(
                name: "Session",
                table: "Voters");

            migrationBuilder.DropColumn(
                name: "Session",
                table: "Candidates");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "AdminUsers",
                newName: "CreateAt");

            migrationBuilder.AddColumn<string>(
                name: "Batch",
                table: "Voters",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Roll",
                table: "Voters",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "Office",
                table: "Candidates",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<string>(
                name: "Batch",
                table: "Candidates",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Roll",
                table: "Candidates",
                type: "TEXT",
                nullable: true);
        }
    }
}
