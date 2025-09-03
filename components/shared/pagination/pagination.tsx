"use client";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center mt-10 space-x-1 py-2">
      {/* Left Arrow */}
      <button
        className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &#8592;
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded-lg whitespace-nowrap ${
              page === currentPage
                ? "bg-green-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Right Arrow */}
      <button
        className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &#8594;
      </button>
    </div>
  );
}
