import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const serverApi = createApi({
    reducerPath: 'serverApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    tagTypes: ['Wishlist'],
    endpoints: builder => ({
        getWishlist: builder.query({
            query: () => '/wishlist',
            providesTags: ['Wishlist'],
        }),
        getWishlistByUser: builder.query({
            query: (username) => `/wishlist/${encodeURIComponent(username)}`,
            providesTags: ['Wishlist'],
        }),
        insertWishlistItem: builder.mutation({
            query: (CheapsharkGameID) => ({
                url: '/wishlist/insert',
                method: 'POST',
                body: { CheapsharkGameID },
            }),
            invalidatesTags: ['Wishlist'],
        }),
        deleteWishlistItem: builder.mutation({
            query: (CheapsharkGameID) => ({
                url: '/wishlist/delete',
                method: 'POST',
                body: { CheapsharkGameID },
            }),
            invalidatesTags: ['Wishlist'],
        }),
    }),
})

export const {
    useGetWishlistQuery,
    useGetWishlistByUserQuery,
    useInsertWishlistItemMutation,
    useDeleteWishlistItemMutation,
} = serverApi
