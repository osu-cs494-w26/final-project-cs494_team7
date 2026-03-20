import { Flex, Text, Button, Section, Badge, Link } from '@radix-ui/themes'
import { useDeleteWishlistItemMutation, useInsertWishlistItemMutation } from '../redux/serverApi'
import { useGetStoresQuery } from '../redux/cheapSharkApi'

export default function WishlistItem({ game, wishlisted, isLoggedIn, currentUser }) {
  const [deleteItem, { isLoading: isDeleting }] = useDeleteWishlistItemMutation()
  const [insertItem, { isLoading: isInserting }] = useInsertWishlistItemMutation()

  const isRemovable = wishlisted && currentUser

  let buttonText
  if (!wishlisted) {
    buttonText = "Add to Wishlist"
  } else if (currentUser) {
    buttonText = "Remove from Wishlist"
  } else {
    buttonText = "On Wishlist"
  }

  // Stores info.
  const { data: stores = [] } = useGetStoresQuery()
  const storesById = Object.fromEntries(
    stores.map(store => [store.storeID, store.storeName])
  )

  const handleToggleWishlist = async () => {
    try {
      if (wishlisted) {
        await deleteItem(game.gameID)
      } else {
        await insertItem(game.gameID)
      }
    } catch (err) {
      console.error("wishlist toggle failed:", err)
    }
  }

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
            <Text size="1" color="gray">
              Added: {new Date(game.DateAdded).toLocaleDateString()}
            </Text>
          </Flex>
        </Flex>
        {isLoggedIn &&
          <Button
            color={isRemovable ? "red" : undefined}
            variant="soft"
            disabled={isDeleting || isInserting}
            onClick={handleToggleWishlist}
          >
            {buttonText}
          </Button>
        }
      </Flex>
      <Flex gap="2" direction="column" mt="2">
        {game.deals
          .filter((deal) => deal.savings > 0)
          .map(deal => (
            <Flex key={deal.dealID} gap="2" align="center">
              <Link
              href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
              >
                {storesById[deal.storeID]}
              </Link>
              Retail Price:
              <Badge>${deal.retailPrice}</Badge>
              Deal Price:
              <Badge>${deal.price}</Badge>
              Savings:
              <Badge>{Math.round(deal.savings)}%</Badge>
            </Flex>
            )
        )}
      </Flex>
    </Section>
  )
}
