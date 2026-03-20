import { useRouteError } from 'react-router';
import { Link, useNavigate } from 'react-router'
import { Section, Text, Button, Flex } from "@radix-ui/themes";


export default function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();
    
    let errorMessage = "Well that wasn't supposed to happen.."
    if(error) {
        errorMessage = error.statusText || error.message
    }
    return (
        <>
            <Section p="5">
                <Flex direction="column" align="center" gap="4">
                    <Text size="6" weight="bold">Something went wrong</Text>
                    <Text color="gray">{errorMessage}</Text>

                    <Flex gap="3">
                        <Link to="/">Home</Link>
                        <Link to="/deals">Deals</Link>
                        <Button onClick={() => navigate(-1)}>Go Back</Button>
                    </Flex>
                </Flex>
            </Section>
        </>
    )
}