import { Box, Flex, Text, Section, Button, TextField } from '@radix-ui/themes'
import { useSigninMutation, useSignupMutation } from '../redux/serverApi'
import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const [signin, { isLoading: isSigningIn }] = useSigninMutation()
  const [signup, { isLoading: isSigningUp }] = useSignupMutation()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }

    try {
      if (isSignup) {
        await signup({ User: username, Pass: password }).unwrap()
      } else {
        await signin({ User: username, Pass: password }).unwrap()
      }
      navigate('/deals')
    } catch (err) {
      if (err.status === 409) {
        setError('Username already exists')
      } else if (err.status === 401) {
        setError('Invalid username or password')
      } else {
        setError('An error occurred. Please try again.')
      }
    }
  }

  return (
    <Section p="4">
      <Flex justify="center" align="center" style={{ minHeight: '400px' }}>
        <Box style={{ width: '100%', maxWidth: '400px' }}>
          <Flex direction="column" gap="6">
            <Box>
              <Text size="8" weight="bold">{isSignup ? 'Create Account' : 'Sign In'}</Text>
            </Box>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Username
                </Text>
                <TextField.Root
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSigningIn || isSigningUp}
                />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Password
                </Text>
                <TextField.Root
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSigningIn || isSigningUp}
                />
              </label>

              {error && <Text color="red" size="2">{error}</Text>}

              <Button
                type="submit"
                disabled={isSigningIn || isSigningUp}
                style={{ marginTop: '12px' }}
              >
                {isSignup ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>

            <Flex align="center" justify="center" gap="2">
              <Text size="2">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsSignup(!isSignup)
                  setError('')
                }}
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Section>
  )
}
