import { Box, Flex, Text, Section, TextField } from '@radix-ui/themes'
import WishlistItem from './WishlistItem'
import { useState } from 'react'
import useWishlistGames from '../hooks/useWishlistGames'
import { APIUrl } from '../config'
import { useEffect } from 'react'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsername, setSelectedUsername] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setIsSearching(true)
    fetch(`${APIUrl}/user/${encodeURIComponent(searchQuery)}`)
    .then((res) => res.json())
    .then((json) => {
      setSearchResults(json)
    })
    .catch(() => {
      console.error(`Something went wrong searching users with query: ${searchQuery}`)
    })
    .finally(() => {
      setIsSearching(false)
    })
  }, [searchQuery])
  
  const {
    gamesData,
    isLoading: isLoadingWishlist,
    wishlistError,
    gamesError
  } = useWishlistGames((selectedUsername ? selectedUsername : ""))

  const handleSearch = (query) => {
    setSearchQuery(query)
    setSelectedUsername(null)
  }

  return (
    <Section p="4">
      <Flex mb="4" direction="column" gap="4">
        <Box style={{ border: '1px solid var(--gray-6)', padding: '4px 12px' }}>
          <Text size="2" weight="medium">Search Users</Text>
        </Box>
        
        <TextField.Root
          placeholder="Search for users with public wishlists..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Flex>

      {searchQuery && (
        <Flex direction="column" gap="4">
          {isSearching ? (
            <Text>Searching...</Text>
          ) : searchResults.length === 0 ? (
            <Text color="gray">No users found matching "{searchQuery}"</Text>
          ) : (
            <Flex direction="column" gap="3">
              <Text weight="bold">Found {searchResults.length} user(s):</Text>
              {searchResults.map((user) => (
                <Box
                  key={user.UserID}
                  style={{
                    border: '1px solid var(--gray-6)',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    backgroundColor: selectedUsername === user.Username ? 'var(--gray-4)' : 'transparent'
                  }}
                  onClick={() => setSelectedUsername(user.Username)}
                >
                  <Text weight="bold">{user.Username}</Text>
                </Box>
              ))}
            </Flex>
          )}
        </Flex>
      )}

      {selectedUsername && (
        <Section mt="6" p="4" style={{ border: '1px solid var(--gray-6)' }}>
          <Box mb="4">
            <Text size="4" weight="bold">{selectedUsername}'s Wishlist</Text>
          </Box>

          {isLoadingWishlist ? (
            <Text>Loading wishlist...</Text>
          ) : gamesData.length === 0 ? (
            <Text color="gray">{selectedUsername}'s wishlist is empty.</Text>
          ) : (
            gamesData.map((game) => (
              <WishlistItem key={game.gameID} game={game} />
            ))
          )}
        </Section>
      )}
    </Section>
  )
}
