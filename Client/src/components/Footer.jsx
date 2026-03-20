import { Section, Flex, Text, Link } from "@radix-ui/themes"

export default function Footer() {
    return (
        <Section style={{borderTop: "1px solid var(--gray-6)", backgroundColor: "var(--gray-2)"}} p="4">
            <Flex direction="column" align="center" wrap="wrap" gap="5">
                <Flex direction="column" gap="1" align="center">
                    <Text size="4" weight="bold">Team</Text>
                    <Text size="2" color="gray">Luke Mahar</Text>
                    <Text size="2" color="gray">Luke Scovel</Text>
                    <Text size="2" color="gray">Cordell Settgast</Text>
                </Flex>
                <Flex>
                    <Text>
                        <Link href="https://github.com/osu-cs494-w26/final-project-cs494_team7" target="_blank" rel="noopener noreferrer">
                            GitHub Repository
                        </Link>
                    </Text>
                </Flex>
                <Text size="2" color="gray">
                    &copy; {new Date().getFullYear()} Game Deal Tracker 
                </Text>
            </Flex>
        </Section>
    )
}