import { Section, Flex, Text, Button, TextField } from '@radix-ui/themes'
import { Search } from 'lucide-react'
import { Outlet, Link, useNavigate } from 'react-router'
import { useGetSessionQuery, useSignoutMutation } from '../redux/serverApi'

export default function Navbar({children}) {
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
      <Section style={{backgroundColor: "var(--gray-5)"}} p={'4'}>
        <Flex align={'center'} justify={'between'}>
          <Flex align="center" gap="6">
            <Text size={'8'}>Game Deals</Text>
            <Flex gap="4">
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
          <div>
            <TextField.Root placeholder="Search For Games">
              <TextField.Slot>
                <Search height={"16px"} width={"16px"} />
              </TextField.Slot>
            </TextField.Root>
          </div>
          <div>
            {username ? (
              <Flex gap="3" align="center">
                <Text size="2">{username}</Text>
                <Button onClick={handleSignOut} variant="soft">Sign Out</Button>
              </Flex>
            ) : (
              <Button onClick={() => navigate('/login')}>Sign In</Button>
            )}
          </div>
        </Flex>
      </Section>
      {children || <Outlet />}
    </>
  )

}