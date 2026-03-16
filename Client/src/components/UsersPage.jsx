import { Box, Flex, Text, Section, TextField } from '@radix-ui/themes'
import { useSearchUsersQuery, useGetWishlistByUserQuery } from '../redux/serverApi'
import WishlistItem from './WishlistItem'
import { useState } from 'react'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsername, setSelectedUsername] = useState(null)
  
  const { data: users = [], isLoading: isSearching } = useSearchUsersQuery(searchQuery, {
    skip: !searchQuery,
  })
  
  const { data: wishlistItems = [], isLoading: isLoadingWishlist } = useGetWishlistByUserQuery(selectedUsername, {
    skip: !selectedUsername,
  })

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
          ) : users.length === 0 ? (
            <Text color="gray">No users found matching "{searchQuery}"</Text>
          ) : (
            <Flex direction="column" gap="3">
              <Text weight="bold">Found {users.length} user(s):</Text>
              {users.map((user) => (
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
          ) : wishlistItems.length === 0 ? (
            <Text color="gray">{selectedUsername}'s wishlist is empty.</Text>
          ) : (
            wishlistItems.map((item) => (
              <WishlistItem key={item.CheapsharkGameID} item={item} />
            ))
          )}
        </Section>
      )}
    </Section>
  )
}
