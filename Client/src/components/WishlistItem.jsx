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
    buttonText = "Remove"
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
      if (wishlisted && currentUser) {
        await deleteItem(game.gameID)
      } else {
        await insertItem(game.gameID)
      }
    } catch (err) {
      console.error("wishlist toggle failed:", err)
    }
  }

  return (
    <Section p={{ initial: '3', sm: '5' }} style={{ borderBottom: '1px solid var(--gray-6)' }}>
      <Flex 
        justify="between" 
        align={{ initial: 'flex-start', sm: 'center' }}
        direction={{ initial: 'column', xs: 'row' }}
        gap={{ initial: '3', sm: '4' }}
      >
        <Flex 
          align={{ initial: 'flex-start', sm: 'center' }} 
          gap={{ initial: '2', sm: '6' }}
        >
          <div style={{ width: '120px', minWidth: '120px', overflow: 'hidden', borderRadius: '8px' }}>
            <img
              src={game.info.thumb}
              alt={game.info.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <Flex direction="column" gap={{ initial: '1', sm: '2' }} width={{ initial: '1', sm: 'auto' }}>
            <Text size={{ initial: '3', sm: '5' }} weight="bold">{game.info.title}</Text>
            <Text size={{ initial: '1', sm: '2' }} color="gray">
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
      <Flex gap={{ initial: '1', sm: '2' }} direction="column" mt="2">
        {game.deals
          .filter((deal) => deal.savings > 0)
          .map(deal => (
            <Flex key={deal.dealID} direction="column" gap={{ initial: '2', sm: '1' }}>
              <Link
                href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                wrap="nowrap"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text size={{ initial: '1', sm: '2' }}>{storesById[deal.storeID]}</Text>
              </Link>
              <Flex gap={{ initial: '2', sm: '2' }} align="center" direction="row" wrap="wrap">
                <Flex direction={{ initial: 'column', xs: 'row' }} align="center" gap={{ initial: '1', sm: '1' }}>
                  <Text size={{ initial: '1', sm: '2' }} color="gray">Retail Price:</Text>
                  <Badge size={{ initial: '1', sm: '2' }}>${deal.retailPrice}</Badge>
                </Flex>
                <Flex direction={{ initial: 'column', xs: 'row' }} align="center" gap={{ initial: '1', sm: '1' }}>
                  <Text size={{ initial: '1', sm: '2' }} color="gray">Deal Price:</Text>
                  <Badge size={{ initial: '1', sm: '2' }}>${deal.price}</Badge>
                </Flex>
                <Flex direction={{ initial: 'column', xs: 'row' }} align="center" gap={{ initial: '1', sm: '1' }}>
                  <Text size={{ initial: '1', sm: '2' }} color="gray">Savings:</Text>
                  <Badge size={{ initial: '1', sm: '2' }}>{Math.round(deal.savings)}%</Badge>
                </Flex>
              </Flex>
            </Flex>
            )
        )}
      </Flex>
    </Section>
  )
}
