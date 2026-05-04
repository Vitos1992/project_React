const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '1acfe39edd6e8959aa7d77b59fd17017';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'uk-UA';

//Кеш на рівні модулів для кредитів, що дозволяє зменшити кількість зайвих викликів API
const creditsCache = new Map();

/**
 * Створює повну URL-адресу API TMDB.
 */
function buildUrl(path, params = '') {
    if (!API_KEY) {
        // Critical: Ensure API key is present in environment
        throw new Error('TMDB API key not found. Please add VITE_TMDB_API_KEY to your .env file.');
    }

    return `${BASE_URL}${path}?api_key=${API_KEY}&language=${LANGUAGE}${params}`;
}

/**
 * Універсальний помічник для обробки запитів з функцією обробки помилок.
 */
async function request(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`TMDB Request Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

/**
 * Виводить список фільмів із 10 елементами на сторінці.
 * Підтримує пошук, фільтрування за жанром та фільтрування за рейтингом.
 */
export async function fetchMovieList(page = 1, filters = {}) {
    const { query, genreId, minRating } = filters;
    const apiPage = Math.ceil(page / 2);
    
    let path = '/movie/popular';
    let params = `&page=${apiPage}`;

    if (query) {
        path = '/search/movie';
        params += `&query=${encodeURIComponent(query)}`;
    } else if (genreId || minRating) {
        path = '/discover/movie';
        if (genreId) params += `&with_genres=${genreId}`;
        if (minRating) params += `&vote_average.gte=${minRating}`;
    }

    const data = await request(buildUrl(path, params));

    const sliceStart = ((page - 1) * 10) % 20;
    const pageItems = data.results.slice(sliceStart, sliceStart + 10);

    const movies = pageItems.map((movie) => ({
        id: movie.id,
        title: movie.title || movie.original_title,
        releaseYear: movie.release_date ? movie.release_date.split('-')[0] : 'Н/Д',
        director: null,
        posterPath: movie.poster_path,
        voteAverage: movie.vote_average
    }));

    return {
        movies,
        currentPage: page,
        totalPages: Math.min(data.total_pages * 2, 1000)
    };
}

/**
 * Отримує список жанрів фільмів.
 */
export async function fetchGenres() {
    const data = await request(buildUrl('/genre/movie/list'));
    return data.genres;
}

/**
 * Отримує ім'я режисера певного фільму.
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
 * Виводить повну інформацію про фільм, включаючи список учасників.
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
