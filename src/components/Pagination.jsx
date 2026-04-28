function Pagination({ currentPage, totalPages, onPageChange }) {
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    const pages = [];

    for (let page = startPage; page <= endPage; page += 1) {
        pages.push(page);
    }

    return (
        <div className="pagination">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Назад
            </button>
            {startPage > 1 && (
                <button type="button" onClick={() => onPageChange(1)}>
                    1
                </button>
            )}
            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    className={page === currentPage ? 'active' : ''}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
            {endPage < totalPages && (
                <button type="button" onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                </button>
            )}
            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Далі
            </button>
        </div>
    );
}

export default Pagination;
