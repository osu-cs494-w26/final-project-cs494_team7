import { Box, Flex, Text, Button, Section, Skeleton } from '@radix-ui/themes'

const game = {
  id: 1,
  title: 'Game Title',
  price: 19.99,
  discount: 9.99,
  tags: ['Action', 'Adventure'],
};

export default function WishlistPage() {
  return (
    <Section p="4">
      <Flex>
        <Box
          style={{
            border: '1px solid var(--gray-6)',
            padding: '4px 12px',
          }}
        >
          <Text size="2" weight="medium">User / WishlistName</Text>
        </Box>
        <Button variant="solid">Filters</Button>
      </Flex>

      <Flex direction="column" gap="4" mt="4">
        {/* Deals List */}
      </Flex>
    </Section>
  )
}
