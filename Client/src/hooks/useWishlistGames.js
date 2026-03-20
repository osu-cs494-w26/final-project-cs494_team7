import useAuth from '../hooks/useAuth'
import { useGetWishlistQuery, useGetWishlistByUserQuery } from '../redux/serverApi'
import { useGetMultipleGamesQuery } from '../redux/cheapSharkApi'
import { useMemo } from 'react'

export default function useWishlistGames(username = null) {
  const { user, isLoggedIn } = useAuth()
  const useOwnWishlist = !username || user?.username === username

  // Get the current user's wishlist if no username given and is logged in.
  const {
    data: ownWishlistItems = [],
    isLoading: isOwnWishlistLoading,
    error: ownWishlistError
  } = useGetWishlistQuery(undefined,
    { skip: !isLoggedIn || !useOwnWishlist }
  )

  // Get a public user's wishlist if given a username.
  const {
    data: userWishlistItems = [],
    isLoading: isUserWishlistLoading,
    error: userWishlistError
  } = useGetWishlistByUserQuery(username,
    { skip: useOwnWishlist }
  )

  // Takes info for whichever query was used.
  const wishlistItems = useOwnWishlist ? ownWishlistItems : userWishlistItems
  const isWishlistLoading = useOwnWishlist ? isOwnWishlistLoading : isUserWishlistLoading
  const wishlistError = useOwnWishlist ? ownWishlistError : userWishlistError

  // Pull out game IDs to pass to mulitpleGamesQuery.
  const wishlistGameIds = useMemo(
    () => wishlistItems.map((item) => String(item.CheapsharkGameID)),
    [wishlistItems]
  )

  // Get game details for each wishlist item.
  const { data: gamesQueryData = [],
    isLoading: isGamesLoading,
    error: gamesError } = useGetMultipleGamesQuery(wishlistGameIds,
    { skip: wishlistGameIds.length === 0 }
  )

  // For including DateAdded from wishlist query in the games data.
  const wishlistGamesById = useMemo(
    () =>  
      Object.fromEntries(
      wishlistItems.map((item) => [
        String(item.CheapsharkGameID),
        {
          DateAdded: item.DateAdded,
          ownWishlist: useOwnWishlist
        }
      ])
    ),
    [wishlistItems]
  )
  
  // Verify there are no wishlisted items, otherwise old data for
  // the last deleted game will stay until refreshed.
  // Also adds in DateAdded to the game data for each item.
  const gamesData = useMemo(
    () =>
      wishlistGameIds.length === 0
      ? []
      : gamesQueryData.map(game => ({
        ...game,
        ...wishlistGamesById[String(game.gameID)]
      })),
    [wishlistGameIds, gamesQueryData, wishlistGamesById]
  )

  const wishlistSet = useMemo(() => {
    return new Set(wishlistItems.map(item => String(item.CheapsharkGameID)))
  }, [wishlistItems])

  return {
      wishlistItems,
      wishlistSet,
      gamesData,
      isLoading: isWishlistLoading || isGamesLoading,
      wishlistError,
      gamesError
  }
}
