async function Call(baseUri, useCase, dtoIn, method) {
  let response;
  if (!method || method === "get") {
    response = await fetch(
      `${baseUri}/${useCase}${
        dtoIn && Object.keys(dtoIn).length
          ? `?${new URLSearchParams(dtoIn)}`
          : ""
      }`
    );
  } else {
    response = await fetch(`${baseUri}/${useCase}`, {
      method: method.toUpperCase(),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
  }
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

const baseUri = "http://localhost:8000";

const FetchHelper = {
  book: {
    get: async (dtoIn) => {
      return await Call(baseUri, "book/get", dtoIn, "get");
    },
    create: async (dtoIn) => {
      return await Call(baseUri, "book/create", dtoIn, "post");
    },
    update: async (dtoIn) => {
      return await Call(baseUri, "book/update", dtoIn, "post");
    },
    delete: async (dtoIn) => {
      return await Call(baseUri, "book/delete", dtoIn, "post");
    },
    list: async () => {
      return await Call(baseUri, "book/list", null, "get");
    },
  },
};

export default FetchHelper;
