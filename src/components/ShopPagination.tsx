import React from "react";
import "../styles/ShopPagination.scss";

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export default function ShopPagination({
  currentPage,
  totalPages,
  goToPage,
  nextPage,
  prevPage,
}: ShopPaginationProps) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = Math.min(maxPagesToShow, totalPages);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const renderPageNumbers = () => {
    const pageNumbers = getPageNumbers();
    const renderedElements = [];
    let lastPageAdded = 0;

    // Always show first page
    if (totalPages > 5 && pageNumbers[0] > 1) {
      renderedElements.push(
        <button
          key={1}
          className={`page-btn ${currentPage === 1 ? "active" : ""}`}
          onClick={() => goToPage(1)}
          aria-label={`Go to page 1`}
        >
          1
        </button>
      );

      // Add ellipsis if there's a gap
      if (pageNumbers[0] > 2) {
        renderedElements.push(
          <span key="ellipsis-start" className="page-dots">
            ...
          </span>
        );
      }
    }

    // Add the main page numbers
    pageNumbers.forEach((pageNumber) => {
      renderedElements.push(
        <button
          key={pageNumber}
          className={`page-btn ${currentPage === pageNumber ? "active" : ""}`}
          onClick={() => goToPage(pageNumber)}
          aria-label={`Go to page ${pageNumber}`}
          aria-current={currentPage === pageNumber ? "page" : undefined}
        >
          {pageNumber}
        </button>
      );
      lastPageAdded = pageNumber;
    });

    // Add ellipsis and last page if needed
    if (totalPages > 5 && lastPageAdded < totalPages) {
      if (lastPageAdded < totalPages - 1) {
        renderedElements.push(
          <span key="ellipsis-end" className="page-dots">
            ...
          </span>
        );
      }

      renderedElements.push(
        <button
          key={totalPages}
          className={`page-btn ${currentPage === totalPages ? "active" : ""}`}
          onClick={() => goToPage(totalPages)}
          aria-label={`Go to last page ${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }

    return renderedElements;
  };

  return (
    <div className="shop-pagination">
      <button
        className={`pagination-btn prev-btn ${currentPage === 1 ? "disabled" : ""}`}
        onClick={prevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="pagination-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <div className="page-numbers">{renderPageNumbers()}</div>

      <button
        className={`pagination-btn next-btn ${currentPage === totalPages ? "disabled" : ""}`}
        onClick={nextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="pagination-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
