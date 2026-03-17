import { Flex, Text, Button, Section, Badge } from '@radix-ui/themes'
import { useDeleteWishlistItemMutation } from '../redux/serverApi'

export default function WishlistItem({ game }) {
  const [deleteItem, { isLoading: isDeleting }] = useDeleteWishlistItemMutation()

  return (
    <Section p="5" style={{ borderBottom: '1px solid var(--gray-6)' }}>
      <Flex justify="between" align="center">
        <Flex align="center" gap="5">
          <div style={{ width: '160px', overflow: 'hidden', borderRadius: '8px' }}>
            <img
              src={game.info.thumb}
              alt={game.info.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <Flex direction="column" gap="2">
            <Text size="5" weight="bold">{game.info.title}</Text>
            <Badge color="gray">Game ID: {game.gameID}</Badge>
            <Text size="1" color="gray">
              Added: {new Date(game.DateAdded).toLocaleDateString()}
            </Text>
          </Flex>
        </Flex>
        <Button
          color="red"
          variant="soft"
          disabled={isDeleting}
          onClick={() => deleteItem(game.gameID)}
        >
          Remove
        </Button>
      </Flex>
    </Section>
  )
}
