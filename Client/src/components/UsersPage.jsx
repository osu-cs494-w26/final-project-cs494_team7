import { Box, Flex, Text, Section, TextField } from '@radix-ui/themes'
import { useSearchUsersQuery } from '../redux/serverApi'
import { useState } from 'react'
import { Link } from 'react-router'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsername, setSelectedUsername] = useState(null)
  
  const { data: users = [], isLoading: isSearching } = useSearchUsersQuery(searchQuery, {
    skip: !searchQuery,
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
                <Link key={user.UserID} to={`/wishlist/${user.Username}`}>
                  <Box
                    style={{
                      border: '1px solid var(--gray-6)',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      backgroundColor: selectedUsername === user.Username ? 'var(--gray-4)' : 'transparent'
                    }}
                  >
                    <Text weight="bold">{user.Username}</Text>
                  </Box>
                </Link>
              ))}
            </Flex>
          )}
        </Flex>
      )}
    </Section>
  )
}
