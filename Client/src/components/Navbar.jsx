import { Section, Flex, Text, Button } from '@radix-ui/themes'
import { Link, useNavigate } from 'react-router'
import { useGetSessionQuery, useSignoutMutation } from '../redux/serverApi'
import { useEffect, useRef } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const { data, error } = useGetSessionQuery()
  const username = error ? undefined : data?.username
  const [signout] = useSignoutMutation()
  const navRef = useRef(null)

  useEffect(() => {
    const setNavHeight = () => {
      const height = navRef.current?.offsetHeight ?? 0
      document.documentElement.style.setProperty('--navbar-height', `${height}px`)
    }

    setNavHeight()
    window.addEventListener('resize', setNavHeight)
    return () => window.removeEventListener('resize', setNavHeight)
  }, [])

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
        style={{ backgroundColor: 'var(--gray-5)', zIndex: '1000'}}
        p={'1'}
        position="sticky"
        width="100%"
        top="0"
        ref={navRef}
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
                style={{ paddingRight: '16px', paddingBottom: '4px', paddingTop: '4px' }}
          >
            {username ? (
                <>
                  <Text size={{ initial: '2', sm: '3' }}>{username}</Text>
                  <Button size={{ initial: '1', sm: '2' }} onClick={handleSignOut} variant="soft">Sign Out</Button>
                </>
            ) : (
                <Button size={{ initial: '1', sm: '2' }} onClick={() => navigate('/login')}>Sign In</Button>
            )}
          </Flex>
        </Flex>
      </Section>
    </>
  )
}