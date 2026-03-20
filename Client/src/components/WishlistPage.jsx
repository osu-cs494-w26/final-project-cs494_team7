import { Box, Flex, Text, Section, Button } from '@radix-ui/themes'
import { useGetWishlistPublicityQuery, useUpdateWishlistPublicityMutation } from '../redux/serverApi'
import WishlistItem from './WishlistItem'
import { useState } from 'react'
import useWishlistGames from '../hooks/useWishlistGames'

export default function WishlistPage() {
  const { gamesData, isLoading, wishlistError, gamesError } = useWishlistGames()
  const [updatePublicity, { isLoading: isUpdating }] = useUpdateWishlistPublicityMutation()
  const isPublic = useGetWishlistPublicityQuery()

  console.log(isPublic)

  const handleTogglePublicity = async () => {
    const newStatus = !isPublic.data
    await updatePublicity(newStatus)
  }

  return (
    <Section p="4">
      <Flex mb="4" justify="between" align="center">
        <Box style={{ border: '1px solid var(--gray-6)', padding: '4px 12px' }}>
          <Text size="2" weight="medium">Wishlist</Text>
        </Box>
        <Button
          onClick={handleTogglePublicity}
          disabled={isUpdating}
          variant={isPublic.data ? "solid" : "soft"}
          color={isPublic.data ? "green" : "gray"}
        >
          {isPublic.data ? "Public" : "Private"}
        </Button>
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
            <WishlistItem key={game.gameID} game={game} />
          ))
        )}
      </Flex>
    </Section>
  )
}
