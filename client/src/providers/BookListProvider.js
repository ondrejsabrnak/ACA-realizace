import { createContext, useState, useEffect, useCallback } from "react";
import FetchHelper from "../helpers/FetchHelper";

export const BookListContext = createContext();

function BookListProvider({ children }) {
  const [bookListDto, setBookListDto] = useState({
    state: "ready", // ready / pending / error
    data: null,
    error: null, // { code: string, message: string }
  });

  const sortBooks = (books) => {
    return [...books].sort((a, b) => {
      // First sort by status (unfinished first)
      if (a.status !== b.status) {
        return a.status === "unfinished" ? -1 : 1;
      }
      // Then sort by title
      return a.title.localeCompare(b.title);
    });
  };

  const handleLoad = useCallback(async () => {
    setBookListDto((current) => {
      return { ...current, state: "pending" };
    });
    try {
      const result = await FetchHelper.book.list();
      setBookListDto((current) => {
        if (result.ok) {
          return {
            ...current,
            state: "ready",
            data: {
              ...result.data,
              data: {
                ...result.data.data,
                items: sortBooks(result.data.data.items),
              },
            },
            error: null,
          };
        } else {
          return {
            ...current,
            state: "error",
            error: result.data.error,
          };
        }
      });
    } catch (error) {
      setBookListDto((current) => ({
        ...current,
        state: "error",
        error: { code: "unexpectedError", message: error.message },
      }));
    }
  }, []);

  async function handleCreate(dtoIn) {
    setBookListDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.book.create(dtoIn);
    setBookListDto((current) => {
      if (result.ok) {
        const newItems = sortBooks([
          ...current.data.data.items,
          result.data.data,
        ]);
        return {
          ...current,
          state: "ready",
          data: {
            ...current.data,
            data: { ...current.data.data, items: newItems },
          },
          error: null,
        };
      } else {
        return {
          ...current,
          state: "error",
          error: result.data.error,
        };
      }
    });
    return {
      ok: result.ok,
      error: result.ok ? undefined : result.data.error,
    };
  }

  async function handleUpdate(dtoIn) {
    setBookListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.book.update(dtoIn);
    setBookListDto((current) => {
      if (result.ok) {
        const itemIndex = current.data.data.items.findIndex(
          (item) => item.id === dtoIn.id
        );
        const newItems = [...current.data.data.items];
        newItems[itemIndex] = result.data.data;
        return {
          ...current,
          state: "ready",
          data: {
            ...current.data,
            data: { ...current.data.data, items: newItems },
          },
          error: null,
          pendingId: undefined,
        };
      } else {
        return {
          ...current,
          state: "error",
          error: result.data.error,
          pendingId: undefined,
        };
      }
    });
    return {
      ok: result.ok,
      error: result.ok ? undefined : result.data.error,
    };
  }

  async function handleDelete(dtoIn) {
    setBookListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.book.delete(dtoIn);
    setBookListDto((current) => {
      if (result.ok) {
        const newItems = current.data.data.items.filter(
          (item) => item.id !== dtoIn.id
        );
        return {
          ...current,
          state: "ready",
          data: {
            ...current.data,
            data: { ...current.data.data, items: newItems },
          },
          error: null,
          pendingId: undefined,
        };
      } else {
        return {
          ...current,
          state: "error",
          error: result.data.error,
          pendingId: undefined,
        };
      }
    });
    return {
      ok: result.ok,
      error: result.ok ? undefined : result.data.error,
    };
  }

  async function handleGet(dtoIn) {
    try {
      const result = await FetchHelper.book.get(dtoIn);
      return {
        ok: result.ok,
        data: result.ok ? result.data.data : undefined,
        error: result.ok ? undefined : result.data.error,
      };
    } catch (error) {
      return {
        ok: false,
        error: { code: "unexpectedError", message: error.message },
      };
    }
  }

  useEffect(() => {
    handleLoad();
  }, [handleLoad]);

  const value = {
    ...bookListDto,
    handlerMap: {
      handleLoad,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleGet,
    },
  };

  return (
    <BookListContext.Provider value={value}>
      {children}
    </BookListContext.Provider>
  );
}

export default BookListProvider;
