namespace WebAPIApp.Film.Helpers
{
    using System;
    using System.Net.Http;
    using System.Text.Json;
    using System.Threading.Tasks;
    using WebAPIApp.Film.Entities;

    public static class TmdbApiHelper
    {
        public static async Task<MovieSearchResponse> GetMoviesAsync(string apiKey, string query)
        {
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new ArgumentException("API key must be provided.", nameof(apiKey));
            if (string.IsNullOrWhiteSpace(query))
                throw new ArgumentException("Query must be provided.", nameof(query));

            string requestUri = $"https://api.themoviedb.org/3/search/movie?api_key={Uri.EscapeDataString(apiKey)}&query={Uri.EscapeDataString(query)}";

            using var httpClient = new HttpClient();
            var jsonResponse = await httpClient.GetStringAsync(requestUri);

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var result = JsonSerializer.Deserialize<MovieSearchResponse>(jsonResponse, options);

            if (result == null)
                throw new InvalidOperationException("Failed to deserialize TMDB response.");

            return result;
        }

        public static async Task<MovieSearchResponse> GetMoviesByCountryAsync(string apiKey, string country)
        {
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new ArgumentException("API key must be provided.", nameof(apiKey));

            string requestUri = $"https://api.themoviedb.org/3/discover/movie?api_key={Uri.EscapeDataString(apiKey)}&with_origin_country={Uri.EscapeDataString(country.ToUpper())}";

            using var httpClient = new HttpClient();
            var jsonResponse = await httpClient.GetStringAsync(requestUri);

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var result = JsonSerializer.Deserialize<MovieSearchResponse>(jsonResponse, options);

            if (result == null)
                throw new InvalidOperationException("Failed to deserialize TMDB response.");

            return result;
        }

        public static async Task<Movie> GetMoviesByIdAsync(string apiKey, int id)
        {
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new ArgumentException("API key must be provided.", nameof(apiKey));

            using var httpClient = new HttpClient();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            string uri = $"https://api.themoviedb.org/3/movie/{id}?api_key={Uri.EscapeDataString(apiKey)}&append_to_response=credits";
            var json = await httpClient.GetStringAsync(uri);
            var result = JsonSerializer.Deserialize<Movie>(json, options);

            if (result == null)
                throw new InvalidOperationException("Failed to deserialize TMDB response.");

            return result;
        }

        public static async Task<MovieSearchResponse> GetMoviesByActorAsync(string apiKey, string actor)
        {
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new ArgumentException("API key must be provided.", nameof(apiKey));

            using var httpClient = new HttpClient();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            string personUri = $"https://api.themoviedb.org/3/search/person?api_key={Uri.EscapeDataString(apiKey)}&query={Uri.EscapeDataString(actor)}";
            var personJson = await httpClient.GetStringAsync(personUri);

            using var doc = JsonDocument.Parse(personJson);
            var results = doc.RootElement.GetProperty("results");

            if (results.GetArrayLength() == 0)
                return new MovieSearchResponse { Results = new List<Movie>() };

            int personId = results[0].GetProperty("id").GetInt32();

            string movieUri = $"https://api.themoviedb.org/3/discover/movie?api_key={Uri.EscapeDataString(apiKey)}&with_cast={personId}&sort_by=popularity.desc";
            var movieJson = await httpClient.GetStringAsync(movieUri);
            var result = JsonSerializer.Deserialize<MovieSearchResponse>(movieJson, options);

            if (result == null)
                throw new InvalidOperationException("Failed to deserialize TMDB response.");

            return result;
        }


        public static async Task<MovieSearchResponse> GetPopularMoviesAsync(string apiKey)
        {
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new ArgumentException("API key must be provided.", nameof(apiKey));

            using var httpClient = new HttpClient();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            string uri = $"https://api.themoviedb.org/3/movie/popular?api_key={Uri.EscapeDataString(apiKey)}";
            var json = await httpClient.GetStringAsync(uri);
            var result = JsonSerializer.Deserialize<MovieSearchResponse>(json, options);

            if (result == null)
                throw new InvalidOperationException("Failed to deserialize TMDB response.");

            return result;
        }

        public static async Task<MovieSearchResponse> GetMoviesByGenreAsync(string apiKey, int genreId)
        {
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new ArgumentException("API key must be provided.", nameof(apiKey));

            using var httpClient = new HttpClient();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            string uri = $"https://api.themoviedb.org/3/discover/movie?api_key={Uri.EscapeDataString(apiKey)}&with_genres={genreId}&sort_by=popularity.desc";
            var json = await httpClient.GetStringAsync(uri);
            var result = JsonSerializer.Deserialize<MovieSearchResponse>(json, options);

            if (result == null)
                throw new InvalidOperationException("Failed to deserialize TMDB response.");

            return result;
        }
    
    public static async Task<MovieSearchResponse> GetMoviesByStudioAsync(string apiKey, string studio)
        {
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new ArgumentException("API key must be provided.", nameof(apiKey));

            using var httpClient = new HttpClient();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            string companyUri = $"https://api.themoviedb.org/3/search/company?api_key={Uri.EscapeDataString(apiKey)}&query={Uri.EscapeDataString(studio)}";
            var companyJson = await httpClient.GetStringAsync(companyUri);

            using var doc = JsonDocument.Parse(companyJson);
            var results = doc.RootElement.GetProperty("results");

            if (results.GetArrayLength() == 0)
                return new MovieSearchResponse { Results = new List<Movie>() };

            int companyId = results[0].GetProperty("id").GetInt32();

            string movieUri = $"https://api.themoviedb.org/3/discover/movie?api_key={Uri.EscapeDataString(apiKey)}&with_companies={companyId}&sort_by=popularity.desc";
            var movieJson = await httpClient.GetStringAsync(movieUri);
            var result = JsonSerializer.Deserialize<MovieSearchResponse>(movieJson, options);

            if (result == null)
                throw new InvalidOperationException("Failed to deserialize TMDB response.");

            return result;
        }
    }
}