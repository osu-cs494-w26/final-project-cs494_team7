import { Flex, Text, Button, Section, Skeleton, Badge } from '@radix-ui/themes'
import { useDeleteWishlistItemMutation } from '../redux/serverApi'
import { useGetGameQuery } from '../redux/cheapSharkApi'

export default function WishlistItem({ item }) {
  const { data, isLoading } = useGetGameQuery(item.CheapsharkGameID)
  const gameInfo = data?.info
  const [deleteItem, { isLoading: isDeleting }] = useDeleteWishlistItemMutation()

  return (
    <Section p="5" style={{ borderBottom: '1px solid var(--gray-6)' }}>
      <Flex justify="between" align="center">
        <Flex align="center" gap="5">
          {isLoading ? (
            <Skeleton width="160px" height="90px" />
          ) : (
            <div style={{ width: '160px', overflow: 'hidden', borderRadius: '8px' }}>
              <img
                src={gameInfo?.thumb}
                alt={gameInfo?.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          )}
          <Flex direction="column" gap="2">
            {isLoading ? (
              <Skeleton width="200px" height="28px" />
            ) : (
              <Text size="5" weight="bold">{gameInfo?.title}</Text>
            )}
            <Badge color="gray">Game ID: {item.CheapsharkGameID}</Badge>
            <Text size="1" color="gray">
              Added: {new Date(item.DateAdded).toLocaleDateString()}
            </Text>
          </Flex>
        </Flex>
        <Button
          color="red"
          variant="soft"
          disabled={isDeleting}
          onClick={() => deleteItem(item.CheapsharkGameID)}
        >
          Remove
        </Button>
      </Flex>
    </Section>
  )
}
