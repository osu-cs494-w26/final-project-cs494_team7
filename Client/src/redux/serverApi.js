import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { APIUrl } from '../config'

export const serverApi = createApi({
    reducerPath: 'serverApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: APIUrl,
        credentials: 'include'
    }),
    tagTypes: ['Wishlist'],
    endpoints: builder => ({
        getWishlist: builder.query({
            query: () => '/wishlist',
            providesTags: ['Wishlist'],
        }),
        getWishlistPublicity: builder.query({
            query: () => '/wishlist/publicity',
            providesTags: ['WishlistPublicity']
        }),
        getWishlistByUser: builder.query({
            query: (username) => `/wishlist/user/${encodeURIComponent(username)}`,
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
        updateWishlistPublicity: builder.mutation({
            query: (IsPublic) => ({
                url: '/wishlist/publicity',
                method: 'POST',
                body: { IsPublic },
            }),
            invalidatesTags: ['Wishlist', 'WishlistPublicity'],
        }),
        getSession: builder.query({
            query: () => '/session',
            providesTags: ['Session'],
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
        }),
        signin: builder.mutation({
            query: (credentials) => ({
                url: '/signin',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Session', 'WishlistPublicity'],
        }),
        signup: builder.mutation({
            query: (credentials) => ({
                url: '/signup',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Session', 'WishlistPublicity'],
        }),
        signout: builder.mutation({
            query: () => ({
                url: '/signout',
                method: 'GET',
            }),
            invalidatesTags: ['Session'],
        }),
    }),
})

export const {
    useGetWishlistQuery,
    useGetWishlistByUserQuery,
    useGetWishlistPublicityQuery,
    useInsertWishlistItemMutation,
    useDeleteWishlistItemMutation,
    useUpdateWishlistPublicityMutation,
    useGetSessionQuery,
    useSigninMutation,
    useSignupMutation,
    useSignoutMutation,
} = serverApi
