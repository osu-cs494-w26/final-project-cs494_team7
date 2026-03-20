import { Box, Flex, Text, Section, Button } from '@radix-ui/themes'
import { useUpdateWishlistPublicityMutation } from '../redux/serverApi'
import WishlistItem from './WishlistItem'
import { useState } from 'react'
import useWishlistGames from '../hooks/useWishlistGames'
import { useParams } from 'react-router'
import useAuth from '../hooks/useAuth.js'
import { useGetWishlistQuery } from '../redux/serverApi'

export default function WishlistPage() {
  const { username } = useParams()
  const { gamesData, isLoading, wishlistError, gamesError } = useWishlistGames(username)
  const [updatePublicity, { isLoading: isUpdating }] = useUpdateWishlistPublicityMutation()
  const [isPublic, setIsPublic] = useState(false)
  const { user, isLoggedIn } = useAuth()

  const { data: myWishlistItems = [] } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn
  })

  const myWishlistSet = new Set(
    myWishlistItems.map((item) => String(item.CheapsharkGameID))
  )

  const handleTogglePublicity = async () => {
    const newStatus = !isPublic
    setIsPublic(newStatus)
    await updatePublicity(newStatus)
  }

  return (
    <Section p="4">
      <Flex mb="4" justify="between" align="center">
        <Box style={{ border: '1px solid var(--gray-6)', padding: '4px 12px' }}>
          <Text size="2" weight="medium">Wishlist</Text>
        </Box>
        {(isLoggedIn && (!username || user?.username === username)) && 
          <Button
            onClick={handleTogglePublicity}
            disabled={isUpdating}
            variant={isPublic ? "solid" : "soft"}
            color={isPublic ? "green" : "gray"}
          >
            {isPublic ? "Public" : "Private"}
          </Button>
        }
      </Flex>

      <Flex direction="column" mt="4">
        {wishlistError || gamesError ? (
          <Text color="red">Could not load wishlist.</Text>
        ) : isLoading ? (
          <Text>Loading...</Text>
        ) : gamesData.length === 0 ? (
          <Text color="gray">Your wishlist is empty.</Text>
        ) : (
          gamesData.map(game => (
            <WishlistItem
              key={game.gameID}
              game={game}
              wishlisted={myWishlistSet.has(String(game.gameID))}
              isLoggedIn={isLoggedIn}
              currentUser={!username || user?.username === username}
            />
          ))
        )}
      </Flex>
    </Section>
  )
}
