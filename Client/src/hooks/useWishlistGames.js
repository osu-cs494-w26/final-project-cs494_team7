import useAuth from '../hooks/useAuth'
import { useGetWishlistQuery } from '../redux/serverApi'
import { useGetMultipleGamesQuery } from '../redux/cheapSharkApi'

export default function useWishlistGames() {
      const { user, isLoggedIn } = useAuth()
    
      // Get wishlist game IDs.
      const { data: wishlistItems = [], isLoading, error: wishlistError } = useGetWishlistQuery(undefined,
        { skip: !isLoggedIn }
      )
    
      // Get game details for each wishlist item.
      const { data: gamesQueryData = [], isLoading: isGamesLoading, error: gamesError } = useGetMultipleGamesQuery(
        wishlistItems.map(item => item.CheapsharkGameID),
        { skip: wishlistItems.length === 0 }
      )
    
      // For including DateAdded from wishlist query in the games data.
      const wishlistGamesById = Object.fromEntries(
        wishlistItems.map((item) => [
          String(item.CheapsharkGameID),
          {
            DateAdded: item.DateAdded
          }
        ])
      )
      
      // Verify there are no wishlisted items, otherwise old data for
      // the last deleted game will stay until refreshed.
      // Also adds in DateAdded to the game data for each item.
      const gamesData = 
        wishlistItems.length === 0
        ? []
        : gamesQueryData.map(game => ({
          ...game,
          ...wishlistGamesById[String(game.gameID)]
        }))

        return {
            gamesData,
            isLoading: isLoading || isGamesLoading,
            wishlistError,
            gamesError
        }
}