# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Voting.Api.csproj ./
RUN dotnet restore Voting.Api.csproj

COPY . ./
RUN dotnet publish Voting.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish ./

ENTRYPOINT ["dotnet", "Voting.Api.dll"]