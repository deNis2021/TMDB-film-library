namespace WebAPIApp.WeatherForecast.Requests
{
    using System;
    using System.Net.Http;
    using System.Threading.Tasks;

    /// <summary>
    /// Represents a request to the WeatherAPI current weather endpoint.
    /// </summary>
    public class WeatherApiRequest
    {
        private const string BaseUrl = "https://api.weatherapi.com/v1/current.json";

        /// <summary>
        /// Gets or sets the API key for authentication.
        /// </summary>
        public string ApiKey { get; set; }

        /// <summary>
        /// Gets or sets the query for the location (city name, postal code, or coordinates).
        /// </summary>
        public string Query { get; set; }

        /// <summary>
        /// Gets or sets whether to include extra parameters (like aaqi). Optional.
        /// </summary>
        public string ExtraParams { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="WeatherApiRequest"/> class.
        /// </summary>
        /// <param name="apiKey">API key for WeatherAPI.</param>
        /// <param name="query">Location query (e.g., city name).</param>
        public WeatherApiRequest(string apiKey, string query)
        {
            ApiKey = apiKey;
            Query = query;
        }

        /// <summary>
        /// Builds the full request URI including query parameters.
        /// </summary>
        /// <returns>The request URI as a string.</returns>
        public string BuildRequestUri()
        {
            var uri = $"{BaseUrl}?key={Uri.EscapeDataString(ApiKey)}&q={Uri.EscapeDataString(Query)}";

            if (!string.IsNullOrEmpty(ExtraParams))
            {
                uri += $"&{ExtraParams}";
            }

            return uri;
        }

        /// <summary>
        /// Sends the request to WeatherAPI and returns the JSON response as a string.
        /// </summary>
        /// <returns>JSON response string.</returns>
        public async Task<string> SendAsync()
        {
            using var httpClient = new HttpClient();
            var uri = BuildRequestUri();
            return await httpClient.GetStringAsync(uri);
        }
    }
}
