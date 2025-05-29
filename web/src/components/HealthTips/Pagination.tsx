import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages: Array<number | string> = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages.map((page, index) =>
      page === '...' ? (
        <span key={`ellipsis-${index}`} className="pagination-ellipsis">
          ...
        </span>
      ) : (
        <button
          key={page}
          onClick={() => onPageChange(page as number)}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button prev-button"
        aria-label="Previous page"
      >
        Previous
      </button>

      <div className="page-numbers">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button next-button"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
