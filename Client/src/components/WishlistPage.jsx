import { Box, Flex, Text, Section } from '@radix-ui/themes'
import { useGetWishlistQuery } from '../redux/serverApi'
import WishlistItem from './WishlistItem'

export default function WishlistPage() {
  const { data: items = [], isLoading, error } = useGetWishlistQuery()

  return (
    <Section p="4">
      <Flex mb="4">
        <Box style={{ border: '1px solid var(--gray-6)', padding: '4px 12px' }}>
          <Text size="2" weight="medium">Wishlist</Text>
        </Box>
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
