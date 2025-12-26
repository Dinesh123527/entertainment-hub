import { createTheme, ThemeProvider } from "@material-ui/core";
import Pagination from "@material-ui/lab/pagination";
import { useTheme as useAppTheme } from "../../context/ThemeContext";

const CustomPagination = ({ setPage, numOfPages = 10, page }) => {
  const { isDark, themeInfo } = useAppTheme();

  const paginationTheme = createTheme({
    palette: {
      type: isDark ? "dark" : "light",
      primary: {
        main: themeInfo?.color || "#e50914",
      },
    },
  });

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scroll(0, 0);
  };

  return (
    <div className="pagination-container">
      <ThemeProvider theme={paginationTheme}>
        <Pagination
          count={numOfPages}
          page={page}
          onChange={handlePageChange}
          hideNextButton
          hidePrevButton
          color="primary"
          className="custom-pagination"
        />
      </ThemeProvider>
      <style>{`
        .pagination-container {
          width: 100%;
          display: flex;
          justify-content: center;
          margin: 30px 0;
          animation: fadeIn 0.5s ease;
        }
        
        .custom-pagination .MuiPaginationItem-root {
          color: var(--text-primary);
          font-family: var(--font-primary);
          font-weight: 500;
          border-radius: var(--border-radius-md);
          transition: all 0.3s ease;
          margin: 0 4px;
          min-width: 36px;
          height: 36px;
        }
        
        .custom-pagination .MuiPaginationItem-root:hover {
          background: var(--card-hover-bg);
          transform: translateY(-2px);
        }
        
        .custom-pagination .MuiPaginationItem-page.Mui-selected {
          background: var(--accent-gradient);
          color: white;
          box-shadow: var(--shadow-sm);
        }
        
        .custom-pagination .MuiPaginationItem-page.Mui-selected:hover {
          background: var(--accent-hover);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CustomPagination;
