import { useEffect, useState } from 'react';
import { fetchGenres } from '../api/tmdb';

function Filters({ onFilterChange }) {
    const [genres, setGenres] = useState([]);
    const [query, setQuery] = useState('');
    const [genreId, setGenreId] = useState('');
    const [minRating, setMinRating] = useState('');

    useEffect(() => {
        fetchGenres().then(setGenres).catch(console.error);
    }, []);

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        onFilterChange({ query: val, genreId, minRating });
    };

    const handleGenreChange = (e) => {
        const val = e.target.value;
        setGenreId(val);
        onFilterChange({ query, genreId: val, minRating });
    };

    const handleRatingChange = (e) => {
        const val = e.target.value;
        setMinRating(val);
        onFilterChange({ query, genreId, minRating: val });
    };

    return (
        <div className="filters-container">
            <div className="filter-group">
                <label htmlFor="search">Пошук:</label>
                <input
                    id="search"
                    type="text"
                    placeholder="Назва фільму..."
                    value={query}
                    onChange={handleSearch}
                    className="filter-input"
                />
            </div>

            <div className="filter-group">
                <label htmlFor="genre">Жанр:</label>
                <select id="genre" value={genreId} onChange={handleGenreChange} className="filter-select">
                    <option value="">Всі жанри</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="rating">Рейтинг від:</label>
                <select id="rating" value={minRating} onChange={handleRatingChange} className="filter-select">
                    <option value="">Будь-який</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <option key={num} value={num}>
                            {num}+
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Filters;
