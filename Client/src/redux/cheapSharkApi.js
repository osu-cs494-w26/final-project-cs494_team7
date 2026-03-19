import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const cheapSharkApi = createApi({
    reducerPath: 'cheapSharkApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://www.cheapshark.com/api/1.0/'}),
    keepUnusedDataFor: 300,
    endpoints: builder => ({
        getDeals: builder.query({
            query: ({
                pageNumber,
                sortBy,
                desc,
                title,
            } = {}) => ({
                url: "/deals",
                params: {
                    pageNumber,
                    sortBy,
                    desc,
                    title,
                }
            }),
            transformResponse: (response, meta) => {
                const totalPages = meta.response.headers.get("x-total-page-count")
                const dealsList = Object.values(response ?? {})
                return {
                    deals: dealsList,
                    totalPages: Number(totalPages)
                }
            }
        }),
        getStores: builder.query({
            query: () => ({
                url: "/stores",
            }),
            transformResponse: (response) => Object.values(response ?? {}),
        }),
        getMultipleGames: builder.query({
            query: (ids) => ({
                url: "/games",
                params: {
                    ids: ids.join(",")
                }
            }),
            transformResponse: (response) => {
                return Object.entries(response).map(([gameID, game]) => ({
                    gameID,
                    ...game
                }))
            },
        }),
        getGame: builder.query({
            query: (id) => ({
                url: "/games",
                params: {
                    id: id
                }
            }),
            transformResponse: (response) => Object.values(response ?? {}),
        }),
    }),
})


export const { useGetDealsQuery, useGetStoresQuery, useGetMultipleGamesQuery, useGetGameQuery,  } = cheapSharkApi
