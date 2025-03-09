"use client"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = []

  // Determine which page numbers to show
  const maxPagesToShow = 5
  let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2))
  const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1)

  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(0, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
        Previous
      </button>

      {startPage > 0 && (
        <>
          <button onClick={() => onPageChange(0)}>1</button>
          {startPage > 1 && <span>...</span>}
        </>
      )}

      {pageNumbers.map((number) => (
        <button key={number} onClick={() => onPageChange(number)} className={currentPage === number ? "active" : ""}>
          {number + 1}
        </button>
      ))}

      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && <span>...</span>}
          <button onClick={() => onPageChange(totalPages - 1)}>{totalPages}</button>
        </>
      )}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
        Next
      </button>
    </div>
  )
}

export default Pagination

