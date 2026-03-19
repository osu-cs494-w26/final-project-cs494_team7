import { Section, Heading, Text, Flex } from "@radix-ui/themes"

export default function HomePage() {
    return (
        <Section size="3">
            <Flex direction="column" gap="4">
                <Heading size="8">Game Deal Tracker</Heading>
                <Text size="3">
                    Track game prices across multiple storefronts, save games to your wishlist,
                    and view public wishlists from other users.
                </Text>
            </Flex>
        </Section>
    )
}