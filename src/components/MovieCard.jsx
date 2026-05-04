import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
    const posterUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
        : null;

    return (
        <Link to={`/movie/${movie.id}`} className="movie-card">
            {posterUrl ? (
                <div className="movie-card-image">
                    <img src={posterUrl} alt={movie.title} loading="lazy" />
                </div>
            ) : (
                <div className="movie-card-placeholder">Постер недоступний</div>
            )}

            <div className="movie-card-body">
                <h3>{movie.title}</h3>
                <p className="movie-field">
                    <span className="field-label">Режисер:</span> {movie.director || 'Невідомий'}
                </p>
                <p className="movie-field">
                    <span className="field-label">Рік:</span> {movie.releaseYear || 'Н/Д'}
                </p>
            </div>
        </Link>
    );
}

export default MovieCard;
