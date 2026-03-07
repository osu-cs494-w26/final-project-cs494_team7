import { Badge, Box, Flex, Section, Skeleton, Text } from "@radix-ui/themes";
import { Menu } from "lucide-react";


export default function Deal() {

  return (
    <Section p="5" style={{borderBottom: "1px solid gray"}}>
      <Flex justify={"between"} align={"center"}>
        <Flex align={"center"} gap={"5"}>
          <Menu />
          <Skeleton>
            <Box width="256px" height="128px" />
          </Skeleton>
          <Flex direction="column" gap="4" justify={"between"}>
            <Text size={"7"}>Game Title</Text>
            <Flex align={"center"} gap="2">
              <Text>Platforms:</Text>
              <Badge>Steam</Badge>
              <Badge>Epic Games</Badge>
              <Badge>GOG</Badge>
            </Flex>
            <Flex align={"center"} gap="2">
              <Text>Tags:</Text>
              <Badge>RPG</Badge>
              <Badge>Space</Badge>
              <Badge>Exploration</Badge>
            </Flex>
          </Flex>
        </Flex>
        <Flex align={"end"} direction={"column"}>
          <Text size={"5"} style={{textDecoration: "line-through", color: "var(--gray-11"}} >
            $59.99
          </Text>
          <Text size={"8"}>
            $29.99
          </Text>
        </Flex>
      </Flex>
    </Section>
  )

}