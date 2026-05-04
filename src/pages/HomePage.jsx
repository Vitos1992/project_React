import { useEffect, useState } from 'react';
import { fetchMovieList } from '../api/tmdb.js';
import MovieCard from '../components/MovieCard.jsx';
import Pagination from '../components/Pagination.jsx';
import Filters from '../components/Filters.jsx';

function HomePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ query: '', genreId: '', minRating: '' });

    useEffect(() => {
        setLoading(true);
        setError('');

        fetchMovieList(currentPage, filters)
            .then((result) => {
                setMovies(result.movies);
                setTotalPages(result.totalPages);
            })
            .catch((fetchError) => {
                setError(fetchError.message || 'Не вдалося завантажити список фільмів.');
            })
            .finally(() => setLoading(false));
    }, [currentPage, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page on filter change
    };

    return (
        <section>
            <h1>Популярні фільми</h1>
            <p className="hint">
                Шукайте фільми, фільтруйте за жанрами та рейтингом.
            </p>

            <Filters onFilterChange={handleFilterChange} />

            {error && <div className="alert">{error}</div>}
            {loading && <div className="loading">Завантаження...</div>}

            {!loading && !error && movies.length === 0 && (
                <div className="hint">Нічого не знайдено за вашим запитом.</div>
            )}

            {!loading && !error && movies.length > 0 && (
                <>
                    <div className="movie-grid">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            )}
        </section>
    );
}

export default HomePage;
