const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '1acfe39edd6e8959aa7d77b59fd17017';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'uk-UA';

// Module-level cache for credits to reduce redundant API calls
const creditsCache = new Map();

/**
 * Builds a full TMDB API URL.
 */
function buildUrl(path, params = '') {
    if (!API_KEY) {
        // Critical: Ensure API key is present in environment
        throw new Error('TMDB API key not found. Please add VITE_TMDB_API_KEY to your .env file.');
    }

    return `${BASE_URL}${path}?api_key=${API_KEY}&language=${LANGUAGE}${params}`;
}

/**
 * Generic request helper with error handling.
 */
async function request(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`TMDB Request Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

/**
 * Fetches a list of movies with 10 items per page.
 * Note: TMDB returns 20 items per page, so we split each TMDB page into two "virtual" pages.
 */
export async function fetchMovieList(page = 1) {
    // TMDB page 1 contains items 1-20 (our pages 1 and 2)
    // TMDB page 2 contains items 21-40 (our pages 3 and 4)
    const apiPage = Math.ceil(page / 2);
    const data = await request(buildUrl('/movie/popular', `&page=${apiPage}`));

    const sliceStart = ((page - 1) * 10) % 20;
    const pageItems = data.results.slice(sliceStart, sliceStart + 10);

    // PERFORMANCE NOTE (Ref: todo.md item 9):
    // We are NOT fetching directors here for every movie.
    // Doing 'await fetchMovieDirector(movie.id)' inside map would cause an "N+1" problem:
    // 1 request for the list + 10 separate requests for directors = 11 requests for one page.
    // This is slow, wastes bandwidth, and hits API rate limits.
    const movies = pageItems.map((movie) => ({
        id: movie.id,
        title: movie.title || movie.original_title,
        releaseYear: movie.release_date ? movie.release_date.split('-')[0] : 'Н/Д',
        director: null, // Displayed as "Unknown" in UI for list view
        posterPath: movie.poster_path
    }));

    return {
        movies,
        currentPage: page,
        // TMDB limits many endpoints to 500 pages (10,000 items)
        totalPages: Math.min(data.total_pages * 2, 1000)
    };
}

/**
 * Fetches the director name for a specific movie.
 */
async function fetchMovieDirector(movieId) {
    if (creditsCache.has(movieId)) {
        return creditsCache.get(movieId);
    }

    try {
        const credits = await request(buildUrl(`/movie/${movieId}/credits`));
        // TMDB 'job' is always in English regardless of the 'language' parameter
        const director = credits.crew.find((person) => person.job === 'Director');
        const name = director?.name || 'Невідомий';

        creditsCache.set(movieId, name);
        return name;
    } catch (error) {
        console.error(`Error fetching director for ${movieId}:`, error);
        return 'Невідомий';
    }
}

/**
 * Fetches full details for a movie, including credits.
 */
export async function fetchMovieDetail(movieId) {
    const detail = await request(buildUrl(`/movie/${movieId}`, '&append_to_response=credits'));

    // Extract director from appended credits
    const director = detail.credits?.crew?.find((person) => person.job === 'Director')?.name || 'Невідомий';

    return {
        id: detail.id,
        title: detail.title || detail.original_title,
        description: detail.overview,
        releaseYear: detail.release_date ? detail.release_date.split('-')[0] : 'Н/Д',
        runtime: detail.runtime,
        genres: detail.genres?.map((genre) => genre.name).join(', '),
        director,
        posterPath: detail.poster_path,
        voteAverage: detail.vote_average,
        homepage: detail.homepage
    };
}
