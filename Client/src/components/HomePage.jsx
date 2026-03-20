import { Section, Heading, Text, Flex, Card, Box } from "@radix-ui/themes"
import { Link } from "react-router"

export default function HomePage() {
    return (
        <Section size={{ initial: '2', sm: '3' }}>
            <Flex direction="column" gap={{ initial: '2', sm: '4' }} align="center">
                <Heading size={{ initial: '6', sm: '8' }}>Game Deal Tracker</Heading>
                <Text size={{ initial: '2', sm: '3' }} align={{ initial: 'center', sm: 'left' }} style={{ maxWidth: "600px" }}>
                    Track game prices across multiple storefronts, save games to your wishlist,
                    and view public wishlists from other users.
                </Text>
                <Flex wrap="wrap" gap={{ initial: '2', sm: '4' }} justify="center">
                    <Link to="/deals" style={{ textDecoration: 'none' }}>
                    <Box style={{ maxWidth: "360px", minWidth: "280px", width: "100%" }}>
                    <Card size={{ initial: '1', sm: '2' }}>
                        <Flex direction="column" gap={{ initial: '1', sm: '2' }}>
                            <Text size={{ initial: '1', sm: '2' }} weight="bold" align="center">Deals</Text>
                            <Text size={{ initial: '1', sm: '2' }}>Find the best game deals across multiple platforms. Compare prices, track discounts, and make smarter purchases.</Text>
                        </Flex>
                    </Card>
                    </Box>
                    </Link>
                    <Link to="/wishlist" style={{ textDecoration: 'none' }}>
                    <Box style={{ maxWidth: "360px", minWidth: "280px", width: "100%" }}>
                    <Card size={{ initial: '1', sm: '2' }}>
                        <Flex direction="column" gap={{ initial: '1', sm: '2' }}>
                            <Text size={{ initial: '1', sm: '2' }} weight="bold" align="center">Wishlist</Text>
                            <Text size={{ initial: '1', sm: '2' }}>Build and manage your personal wishlist. Track games you care about and stay updated on price changes.</Text>
                        </Flex>
                    </Card>
                    </Box>
                    </Link>
                    <Link to="/users" style={{ textDecoration: 'none' }}>
                    <Box style={{ maxWidth: "360px", minWidth: "280px", width: "100%" }}>
                    <Card size={{ initial: '1', sm: '2' }}>
                        <Flex direction="column" gap={{ initial: '1', sm: '2' }}>
                            <Text size={{ initial: '1', sm: '2' }} weight="bold" align="center">Explore Wishlists</Text>
                            <Text size={{ initial: '1', sm: '2' }}>Browse public wishlists from other users. Discover new games and share your own collection with others.</Text>
                        </Flex>
                    </Card>
                    </Box>
                    </Link>
                </Flex>
            </Flex>
        </Section>
    )
}