import React from 'react';
import { PaginationLinks } from './models';

interface PaginationProps {
    paginationLinks: PaginationLinks;
    handleNavigation: (url: string) => void;
}

export default function Pagination({ paginationLinks, handleNavigation }: PaginationProps) {
    return (
        <div className="flex justify-center space-x-4 mt-4">
            {paginationLinks.first && (
                <button
                    onClick={() => handleNavigation(paginationLinks.first)}
                    className="px-3 py-1 border rounded"
                >
                    First
                </button>
            )}
            {paginationLinks.prev && (
                <button
                    onClick={() => handleNavigation(paginationLinks.prev!)}
                    className="px-3 py-1 border rounded"
                >
                    Previous
                </button>
            )}
            {paginationLinks.next && (
                <button
                    onClick={() => handleNavigation(paginationLinks.next!)}
                    className="px-3 py-1 border rounded"
                >
                    Next
                </button>
            )}
            {paginationLinks.last && (
                <button
                    onClick={() => handleNavigation(paginationLinks.last)}
                    className="px-3 py-1 border rounded"
                >
                    Last
                </button>
            )}
        </div>
    );
}
