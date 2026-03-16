import { Box, Flex, Text, Section, Button } from '@radix-ui/themes'
import { useGetWishlistQuery, useUpdateWishlistPublicityMutation } from '../redux/serverApi'
import WishlistItem from './WishlistItem'
import { useState } from 'react'

export default function WishlistPage() {
  const { data: items = [], isLoading, error } = useGetWishlistQuery()
  const [updatePublicity, { isLoading: isUpdating }] = useUpdateWishlistPublicityMutation()
  const [isPublic, setIsPublic] = useState(false)

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
        <Button
          onClick={handleTogglePublicity}
          disabled={isUpdating}
          variant={isPublic ? "solid" : "soft"}
          color={isPublic ? "green" : "gray"}
        >
          {isPublic ? "Public" : "Private"}
        </Button>
      </Flex>

      <Flex direction="column" mt="4">
        {error ? (
          <Text color="red">Could not load wishlist.</Text>
        ) : isLoading ? (
          <Text>Loading...</Text>
        ) : items.length === 0 ? (
          <Text color="gray">Your wishlist is empty.</Text>
        ) : (
          items.map(item => (
            <WishlistItem key={item.CheapsharkGameID} item={item} />
          ))
        )}
      </Flex>
    </Section>
  )
}
