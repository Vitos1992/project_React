import { useEffect, useState } from 'react';
import { fetchMovieList } from '../api/tmdb.js';
import MovieCard from '../components/MovieCard.jsx';
import Pagination from '../components/Pagination.jsx';

function HomePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');

        fetchMovieList(currentPage)
            .then((result) => {
                setMovies(result.movies);
                setTotalPages(result.totalPages);
            })
            .catch((fetchError) => {
                setError(fetchError.message || 'Не вдалося завантажити список фільмів.');
            })
            .finally(() => setLoading(false));
    }, [currentPage]);

    return (
        <section>
            <h1>Популярні фільми</h1>
            <p className="hint">
                Сторінка показує до 10 фільмів на лист. Натисніть на картку, щоб побачити більше інформації.
            </p>

            {error && <div className="alert">{error}</div>}
            {loading && <div className="loading">Завантаження...</div>}

            {!loading && !error && (
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </section>
    );
}

export default HomePage;
