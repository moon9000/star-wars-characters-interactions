import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AllCharactersQuery, Character } from "../../types/Character";

// Define a service using a base URL and expected endpoints
export const characterApi = createApi({
  reducerPath: "characterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://swapi.dev/api`,
  }),
  endpoints: (builder) => ({
    getAllCharacters: builder.query<AllCharactersQuery, void>({
      query: () => `people`,
    }),
    getCharacterById: builder.query<Character, string>({
      query: (id) => `people/${id}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllCharactersQuery, useGetCharacterByIdQuery } =
  characterApi;
