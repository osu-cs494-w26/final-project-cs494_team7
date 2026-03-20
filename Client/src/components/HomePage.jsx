import { Section, Heading, Text, Flex, Card, Box } from "@radix-ui/themes"

export default function HomePage() {
    return (
        <Section size="3">
            <Flex direction="column" gap="4" align="center">
                <Heading size="8">Game Deal Tracker</Heading>
                <Text size="3">
                    Track game prices across multiple storefronts, save games to your wishlist,
                    and view public wishlists from other users.
                </Text>
                <Flex wrap="wrap" gap="4" justify="center">
                    <Box style={{ maxWidth: "360px", minWidth: "280px", width: "100%" }}>
                    <Card size="2">
                        <Flex direction="column">
                            <Text weight="bold" align="center">Deals</Text>
                            <Text size="3">Find the best game deals across multiple platforms. Compare prices, track discounts, and make smarter purchases.</Text>
                        </Flex>
                    </Card>
                    </Box>
                    <Box style={{ maxWidth: "360px", minWidth: "280px", width: "100%" }}>
                    <Card size="2">
                        <Flex direction="column">
                            <Text weight="bold" align="center">Wishlist</Text>
                            <Text size="3">Build and manage your personal wishlist. Track games you care about and stay updated on price changes.</Text>
                        </Flex>
                    </Card>
                    </Box>
                    <Box style={{ maxWidth: "360px", minWidth: "280px", width: "100%" }}>
                    <Card size="2">
                        <Flex direction="column">
                            <Text weight="bold" align="center">Explore Wishlists</Text>
                            <Text size="3">Browse public wishlists from other users. Discover new games and share your own collection with others.</Text>
                        </Flex>
                    </Card>
                    </Box>
                </Flex>
            </Flex>
        </Section>
    )
}