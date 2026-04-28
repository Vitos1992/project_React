import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import MovieDetailPage from './pages/MovieDetailPage.jsx';

function App() {
    return (
        <BrowserRouter>
            <div className="app-shell">
                <header className="app-header">
                    <Link to="/" className="brand">
                        Movie/Series Explorer
                    </Link>
                </header>

                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/movie/:id" element={<MovieDetailPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
