import { Button } from "../../components/ui/button";
import { useLibraryPreferences } from "../../contexts/LibraryPreferencesContext";

type GalleryPaginationProps = {
  totalItems: number;
  totalPages: number;
};

export const GalleryPagination = ({ totalItems, totalPages }: GalleryPaginationProps) => {
  const { preferences, updatePaginationPreferences } = useLibraryPreferences();

  const currentPage = preferences.pagination.page;

  const handlePageChange = (page: number) => {
    updatePaginationPreferences({ page });
  };

  return (
    <div className="flex justify-between items-center mt-4 pt-4 flex-none">
      <div className="text-sm text-muted-foreground">
        {totalItems} items • Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
