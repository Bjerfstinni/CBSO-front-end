import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";

const PaginateButton = ({
    dataLength = 0, // Ensure a default value
    numberOfPage = 1, // Ensure a default value
    setPage,
    page = 1, // Ensure a default value
    itemsPerPage = 10, // Default to 10 items per page
    divTailwindcss,
    bttnTailwindcss,
    spanCSS,
  }) => {
    const goToPage = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= numberOfPage) {
        setPage(pageNumber);
      }
    };
  
    const nextPage = () => {
      if (page < numberOfPage) {
        setPage(page + 1);
      }
    };
  
    const prevPage = () => {
      if (page > 1) {
        setPage(page - 1);
      }
    };
  
    const startRecord = dataLength > 0 ? (page - 1) * itemsPerPage + 1 : 0;
    const endRecord = Math.min(page * itemsPerPage, dataLength);
  
    return (
      <div className={divTailwindcss}>
        <p>
          Showing {startRecord} to {endRecord} of {dataLength} records
        </p>
        <div className={spanCSS}>
          <button
            onClick={prevPage}
            className={bttnTailwindcss}
            disabled={page <= 1}
          >
            <RxDoubleArrowLeft />
          </button>
          {Array.from({ length: numberOfPage }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`${bttnTailwindcss} ${page === pageNum ? "bg-blue-500 text-blue" : ""}`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={nextPage}
            className={bttnTailwindcss}
            disabled={page >= numberOfPage}
          >
            <RxDoubleArrowRight />
          </button>
        </div>
      </div>
    );
  };
  
export default PaginateButton;
