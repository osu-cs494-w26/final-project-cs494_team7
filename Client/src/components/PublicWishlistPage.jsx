import { useParams } from 'react-router'
import WishlistItem from './WishlistItem'
import useWishlistGames from '../hooks/useWishlistGames'
import { Text, Section, Flex } from '@radix-ui/themes'

export default function PublicWishlistPage() {
    const { username } = useParams()
    const {
        gamesData,
        isLoading: isLoadingWishlist,
        wishlistError,
        gamesError
    } = useWishlistGames(username)
    return (
        <>
            <Flex justify="center" align="center">
                <h1>{username}'s Wishlist</h1>
            </Flex>
            {username && (
            <Section mt="6" p="4" style={{ border: '1px solid var(--gray-6)' }}>

            {isLoadingWishlist ? (
                <Text>Loading wishlist...</Text>
            ) : gamesData.length === 0 ? (
                <Text color="gray">{username}'s wishlist is empty.</Text>
            ) : (
                gamesData.map((game) => (
                <WishlistItem key={game.gameID} game={game} />
                ))
            )}
            </Section>
        )}
      </>
    )
}