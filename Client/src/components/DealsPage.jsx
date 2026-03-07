import { Section, Text, Button, Flex } from "@radix-ui/themes";
import Deal from "./Deal";


export default function DealsPage() {

  return (
    <>
      <Section p="3" style={{backgroundColor: "var(--gray-2)"}}>
        <Flex gap="5" align="center">
          <Button color={"bronze"} >Filter Deals</Button>
        </Flex>
      </Section>
      <Deal />
      <Deal />
      <Deal />
    </>
  )

}