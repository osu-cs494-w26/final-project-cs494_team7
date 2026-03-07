import { Section, Flex, Text, Button, TextField } from '@radix-ui/themes'
import { Search } from 'lucide-react'
import { Outlet } from 'react-router'

export default function Navbar({children}) {

  return (
    <>
      <Section style={{backgroundColor: "var(--gray-5)"}} p={'4'}>
        <Flex align={'center'} justify={'between'}>
          <div>
            <Text size={'8'}>Game Deals</Text>
          </div>
          <div>
            <TextField.Root placeholder="Search For Games">
              <TextField.Slot>
                <Search height={"16px"} width={"16px"} />
              </TextField.Slot>
            </TextField.Root>
          </div>
          <div>
            <Button>Sign In</Button>
          </div>
        </Flex>
      </Section>
      {children || <Outlet />}
    </>
  )

}