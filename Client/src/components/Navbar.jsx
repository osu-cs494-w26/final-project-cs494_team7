import { Section, Flex, Text, Button } from '@radix-ui/themes'
import { Link, useNavigate } from 'react-router'
import { useGetSessionQuery, useSignoutMutation } from '../redux/serverApi'

export default function Navbar() {
  const navigate = useNavigate()
  const { data } = useGetSessionQuery()
  const username = data?.username
  const [signout] = useSignoutMutation()

  const handleSignOut = async () => {
    try {
      await signout()
      navigate('/login')
    } catch (err) {
      console.error('Sign out failed:', err)
    }
  }

  return (
    <>
      <Section
        style={{ backgroundColor: 'var(--gray-5)', zIndex: '1000' }}
        p={4}
        position="sticky"
        top="0"
      >
        <Flex
          align={{ initial: 'flex-start', sm: 'center' }}
          justify="between"
          direction={{ initial: 'column', xs: 'row' }}
          gap={{ initial: '2', sm: '6' }}
        >
          <Flex
            align="center"
            direction={{ initial: 'column', xs: 'row' }}
            gap={{ initial: '3', sm: '6' }}
            width={{ initial: '100%', sm: 'auto' }}
          >
            <Text size={{ initial: '5', sm: '8' }}>Game Deals</Text>
            <Flex
              gap="4"
              direction="row"
            >
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/deals" style={{ textDecoration: 'none' }}>
                <Button variant="ghost">Deals</Button>
              </Link>
              <Link to="/wishlist" style={{ textDecoration: 'none' }}>
                <Button variant="ghost">Wishlist</Button>
              </Link>
              <Link to="/users" style={{ textDecoration: 'none' }}>
                <Button variant="ghost">Users</Button>
              </Link>
            </Flex>
          </Flex>
          <Flex
                align="center"
                justify="center"
                gap={{ initial: '2', sm: '3' }}
                direction="row"
          >
            {username ? (
                <>
                  <Text size={{ initial: '2', sm: '3' }}>{username}</Text>
                  <Button onClick={handleSignOut} variant="soft">Sign Out</Button>
                </>
            ) : (
                <Button onClick={() => navigate('/login')}>Sign In</Button>
            )}
          </Flex>
        </Flex>
      </Section>
    </>
  )
}