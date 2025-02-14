import { createContext, useState, useCallback } from "react";
import FetchHelper from "../helpers/FetchHelper";

export const ReadingRecordListContext = createContext();

function ReadingRecordListProvider({ children }) {
  const [readingRecordListDto, setReadingRecordListDto] = useState({
    state: "ready", // ready / pending / error
    data: null,
    error: null, // { code: string, message: string }
    currentBookId: null,
  });

  const handleListByBookId = useCallback(
    async (dtoIn, { showLoading = true } = {}) => {
      // If we're already loading records for this book, don't start another request
      if (
        readingRecordListDto.state === "pending" &&
        readingRecordListDto.currentBookId === dtoIn.bookId
      ) {
        return;
      }

      // Nastavíme pending state pouze pokud je showLoading true
      if (showLoading) {
        setReadingRecordListDto((current) => ({
          ...current,
          state: "pending",
          currentBookId: dtoIn.bookId,
          error: null,
        }));
      }

      try {
        const result = await FetchHelper.readingRecord.listByBookId(dtoIn);

        // Check if the bookId is still the same (user hasn't navigated away)
        setReadingRecordListDto((current) => {
          if (current.currentBookId !== dtoIn.bookId) {
            return current; // Don't update if we've switched to a different book
          }

          if (result.ok) {
            return {
              ...current,
              state: "ready",
              data: result.data,
              error: null,
            };
          } else {
            return {
              ...current,
              state: "error",
              data: null,
              error: result.data.error,
            };
          }
        });

        return {
          ok: result.ok,
          error: result.ok ? undefined : result.data.error,
        };
      } catch (error) {
        setReadingRecordListDto((current) => {
          if (current.currentBookId !== dtoIn.bookId) {
            return current;
          }

          return {
            ...current,
            state: "error",
            data: null,
            error: { code: "unexpectedError", message: error.message },
          };
        });

        return {
          ok: false,
          error: { code: "unexpectedError", message: error.message },
        };
      }
    },
    [readingRecordListDto.state, readingRecordListDto.currentBookId]
  );

  const handleCreate = useCallback(async (dtoIn) => {
    try {
      const result = await FetchHelper.readingRecord.create(dtoIn);
      return result;
    } catch (error) {
      return {
        ok: false,
        error: { code: "unexpectedError", message: error.message },
      };
    }
  }, []);

  const handleDelete = useCallback(
    async (dtoIn) => {
      try {
        const result = await FetchHelper.readingRecord.delete({ id: dtoIn.id });
        if (result.ok) {
          // Refresh the list after successful deletion
          await handleListByBookId({ bookId: dtoIn.bookId });
          return result;
        } else {
          return {
            ok: false,
            error: result.data.error,
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: { code: "unexpectedError", message: error.message },
        };
      }
    },
    [handleListByBookId]
  );

  const handleUpdate = useCallback(
    async (dtoIn) => {
      try {
        const result = await FetchHelper.readingRecord.update(dtoIn);
        if (result.ok) {
          // Refresh the list after successful update
          await handleListByBookId({ bookId: result.data.data.bookId });
        }
        return result;
      } catch (error) {
        return {
          ok: false,
          error: { code: "unexpectedError", message: error.message },
        };
      }
    },
    [handleListByBookId]
  );

  const value = {
    ...readingRecordListDto,
    handlerMap: {
      handleListByBookId,
      handleCreate,
      handleDelete,
      handleUpdate,
    },
  };

  return (
    <ReadingRecordListContext.Provider value={value}>
      {children}
    </ReadingRecordListContext.Provider>
  );
}

export default ReadingRecordListProvider;
