import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
    return (
        <Link to={`/movie/${movie.id}`} className="movie-card">
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
