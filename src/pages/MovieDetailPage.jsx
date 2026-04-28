import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetail } from '../api/tmdb.js';

function MovieDetailPage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError('');

        fetchMovieDetail(id)
            .then((result) => setMovie(result))
            .catch((fetchError) => {
                setError(fetchError.message || 'Не вдалося завантажити дані фільму.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <section>
            <Link to="/" className="back-link">
                &larr; Назад до списку
            </Link>

            {loading && <div className="loading">Завантаження даних фільму...</div>}
            {error && <div className="alert">{error}</div>}

            {movie && (
                <div className="detail-card">
                    {movie.posterPath ? (
                        <img
                            className="detail-poster"
                            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                            alt={movie.title}
                        />
                    ) : (
                        <div className="detail-poster placeholder">Без зображення</div>
                    )}

                    <div className="detail-info">
                        <h2>{movie.title}</h2>
                        <div className="detail-meta">
                            <span>Рік: {movie.releaseYear}</span>
                            <span>Режисер: {movie.director}</span>
                            <span>Жанри: {movie.genres || 'Н/Д'}</span>
                            <span>Тривалість: {movie.runtime ? `${movie.runtime} хв` : 'Н/Д'}</span>
                        </div>
                        <p>{movie.description || 'Опис відсутній.'}</p>
                        {movie.homepage && (
                            <a className="detail-link" href={movie.homepage} target="_blank" rel="noreferrer">
                                Офіційний сайт фільму
                            </a>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

export default MovieDetailPage;
