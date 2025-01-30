# Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy the solution and project files
COPY ./*.sln ./
COPY ./LifeGuard/*.csproj ./LifeGuard_API/
COPY ./Application/*.csproj ./Application/
COPY ./Domain/*.csproj ./Domain/
COPY ./Infrastructure/*.csproj ./Infrastructure/
COPY ./Identity/*.csproj ./Identity/
COPY ./Persistence/*.csproj ./Persistence/


# Restore the dependenciesvcb 
#RUN dotnet restore

# Copy the rest of the files
COPY . ./

# Install EF tools in the build environment
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Publish the application
RUN dotnet publish ./LifeGuard/LifeGuard.csproj -c Release -o /app/out

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy the published application
COPY --from=build-env /app/out .

# Ensure the PATH includes the directory where dotnet-ef is installed
ENV PATH="$PATH:/root/.dotnet/tools"

# Expose the custom port
EXPOSE 5203

# Set environment variables
ENV ASPNETCORE_URLS=http://*:${PORT:-5203}
ENV ASPNETCORE_ENVIRONMENT=Development
ENV CORS_ORIGINS=http://localhost:3000,https://lifeguard-vert.vercel.app,https://lifeguard-vq69.onrender.com

# Copy and set permissions for the entrypoint script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Run the entrypoint script
CMD ["./entrypoint.sh"]
