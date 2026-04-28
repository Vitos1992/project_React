// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '1acfe39edd6e8959aa7d77b59fd17017';
// console.log(import.meta.env.VITE_TMDB_API_KEY)
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'uk-UA';

function buildUrl(path, params = '') {
    if (!API_KEY) {
        throw new Error('Не знайдено TMDB API ключ. Створіть файл .env з VITE_TMDB_API_KEY=YOUR_KEY.');
    }

    return `${BASE_URL}${path}?api_key=${API_KEY}&language=${LANGUAGE}${params}`;
}

async function request(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Помилка запиту TMDB: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

export async function fetchMovieList(page = 1) {
    const apiPage = Math.ceil(page / 2);
    const data = await request(buildUrl('/movie/popular', `&page=${apiPage}`));
    const sliceStart = ((page - 1) * 10) % 20;
    const pageItems = data.results.slice(sliceStart, sliceStart + 10);

    const movies = await Promise.all(
        pageItems.map(async (movie) => ({
            id: movie.id,
            title: movie.title || movie.original_title,
            releaseYear: movie.release_date ? movie.release_date.split('-')[0] : 'Н/Д',
            director: await fetchMovieDirector(movie.id),
            posterPath: movie.poster_path
        }))
    );

    return {
        movies,
        currentPage: page,
        totalPages: Math.ceil(data.total_results / 10) || 1
    };
}

async function fetchMovieDirector(movieId) {
    const credits = await request(buildUrl(`/movie/${movieId}/credits`));
    const director = credits.crew.find((person) => person.job === 'Director' || person.job === 'Режисер');
    return director?.name || 'Невідомий';
}

export async function fetchMovieDetail(movieId) {
    const detail = await request(buildUrl(`/movie/${movieId}`, '&append_to_response=credits'));
    const director = detail.credits?.crew?.find((person) => person.job === 'Director' || person.job === 'Режисер')?.name || 'Невідомий';

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
