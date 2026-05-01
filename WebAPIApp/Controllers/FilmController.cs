using Microsoft.AspNetCore.Mvc;
using WebAPIApp.Film.Entities;
using WebAPIApp.Film.Helpers;

namespace WebAPIApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FilmController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public FilmController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("search/{query}", Name = "GetMovies")]
        public async Task<MovieSearchResponse> Get(string query)
        {
            string apiKey = _configuration["TmdbApi:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey)) 
                return null;

            return await TmdbApiHelper.GetMoviesAsync(apiKey, query);
        }

        [HttpGet("country/{country}", Name = "GetMoviesByCountry")]
        public async Task<IActionResult> GetByCountry(string country)
        {

            string apiKey = _configuration["TmdbApi:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "API key is missing");

           var result = await TmdbApiHelper.GetMoviesByCountryAsync(apiKey, country);
           return Ok(result);
            
        }

        [HttpGet("Id/{Id}", Name = "GetMoviesById")]
        public async Task<IActionResult> GetById(int Id)
        {
            string apiKey = _configuration["TmdbApi:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "API key is missing");

            var result = await TmdbApiHelper.GetMoviesByIdAsync(apiKey, Id);
            return Ok(result);
        }


        [HttpGet("Actor/{Actor}", Name = "GetMoviesByActor")]
        public async Task<IActionResult> GetByActor(string Actor)
        {
            string apiKey = _configuration["TmdbApi:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "API key is missing");

            var result = await TmdbApiHelper.GetMoviesByActorAsync(apiKey, Actor);
            return Ok(result);
        }

        [HttpGet("Popular", Name = "GetPopularMovies")]
        public async Task<IActionResult> GetPopular()
        {
            string apiKey = _configuration["TmdbApi:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "API key is missing");

            var result = await TmdbApiHelper.GetPopularMoviesAsync(apiKey);
            return Ok(result);
        }

        [HttpGet("Genre/{genreId}", Name = "GetMoviesByGenre")]
        public async Task<IActionResult> GetByGenre(int genreId)
        {
            string apiKey = _configuration["TmdbApi:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "API key is missing");

            var result = await TmdbApiHelper.GetMoviesByGenreAsync(apiKey, genreId);
            return Ok(result);
        }

        [HttpGet("Studio/{studio}", Name = "GetMoviesByStudio")]
        public async Task<IActionResult> GetByStudio(string studio)
        {
            string apiKey = _configuration["TmdbApi:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "API key is missing");
            var result = await TmdbApiHelper.GetMoviesByStudioAsync(apiKey, studio);
            return Ok(result);
        }
    }
}
