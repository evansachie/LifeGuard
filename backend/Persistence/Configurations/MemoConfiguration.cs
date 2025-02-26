using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Configurations
{
    public class MemoConfiguration : IEntityTypeConfiguration<Memos>
    {
        public void Configure(EntityTypeBuilder<Memos> builder)
        {
            builder.HasData(
                new Memos
                {
                    Id = 1, 
                    UserId = "7a223968-23b4-4652-z7b7-8574d048cdb9",
                    Text = "Hi, This is my first Memo",
                    Done = false,



                });
        }
    }
}
