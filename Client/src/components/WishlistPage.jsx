import { useState, useEffect } from 'react'
import { Box, Flex, Text, Button, Section, Skeleton } from '@radix-ui/themes'
import { APIUrl } from '../config.jsx'

export default function WishlistPage() {
  const [items, setItems] = useState([])
  const [gameDetails, setGameDetails] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${APIUrl}/wishlist`)
      .then(res => res.ok ? res.json() : [])
      .then(async (wishlistItems) => {
        setItems(wishlistItems)
        const detailEntries = await Promise.all(
          wishlistItems.map(async ({ CheapsharkGameID }) => {
            const res = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${CheapsharkGameID}`)
            const data = res.ok ? await res.json() : null
            return [CheapsharkGameID, data]
          })
        )
        setGameDetails(Object.fromEntries(detailEntries))
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  function removeFromWishlist(gameID) {
    fetch(`${APIUrl}/wishlist/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CheapsharkGameID: gameID }),
    }).then(res => {
      if (res.ok) setItems(prev => prev.filter(i => i.CheapsharkGameID !== gameID))
    })
  }

  return (
    <Section p="4">
      <Flex mb="4">
        <Box style={{ border: '1px solid var(--gray-6)', padding: '4px 12px' }}>
          <Text size="2" weight="medium">{/* username ??  */'Not signed in'} / Wishlist</Text>
        </Box>
        <Button variant="solid">Filters</Button>
      </Flex>

      <Flex direction="column" gap="4" mt="4">
        {/* Deals List */}
      </Flex>
    </Section>
  )
}
