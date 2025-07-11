import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxPageButtons?: number;
    className?: string;
    showWhenSearching?: boolean;
    searchQuery?: string;
    itemsPerPage?: number;
    totalItems?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    maxPageButtons = 5,
    className = '',
    showWhenSearching = true,
    searchQuery = '',
    itemsPerPage = 20,
    totalItems = 0
}) => {
    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = [];
    let startPage = Math.max(0, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(0, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (page: number) => {
        if (page >= 0 && page < totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    return (
        <div className={`d-flex justify-content-center my-4 ${className}`}>
            <ul className="pagination">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} />
                    </button>
                </li>

                {startPage > 0 && (
                    <>
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(0)}
                            >
                                1
                            </button>
                        </li>
                        {startPage > 1 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                    </>
                )}

                {pageNumbers.map(number => (
                    <li
                        key={number}
                        className={`page-item ${currentPage === number ? 'active' : ''}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(number)}
                        >
                            {number + 1}
                        </button>
                    </li>
                ))}

                {endPage < totalPages - 1 && (
                    <>
                        {endPage < totalPages - 2 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(totalPages - 1)}
                            >
                                {totalPages}
                            </button>
                        </li>
                    </>
                )}

                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} />
                    </button>
                </li>
            </ul>
        </div>
    );
};