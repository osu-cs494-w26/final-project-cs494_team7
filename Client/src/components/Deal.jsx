import { Badge, Flex, Section, Text, Button, Link } from "@radix-ui/themes";
import { Menu } from "lucide-react";
import { useInsertWishlistItemMutation } from "../redux/serverApi";


export default function Deal({ dealData, storeName, isLoggedIn, wishlisted }) {
  const [insertItem, { isLoading }] = useInsertWishlistItemMutation()

  const handleAddToWishlist = async () => {
    try {
      await insertItem(dealData.gameID)
    } catch (err) {
      console.error('Failed to add to wishlist:', err)
    }
  }

  return (
    <Section p="5" style={{borderBottom: "1px solid gray"}}>
      <Flex justify={"between"} align={"center"}>
        <Flex align={"center"} gap={"5"}>
          <Menu />
          <div style={{
            width: "160px",
            overflow: "hidden",
            borderRadius: "8px"
          }}>
            <img
              src={dealData.thumb}
              alt={dealData.title}
              style={{
                width: "100%",
                height: "auto",
                display: "block"
              }}
            />
          </div>
          <Flex direction="column" gap="4" justify={"between"}>
          <Link
            href={`https://www.cheapshark.com/redirect?dealID=${dealData.dealID}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text size={"7"}>{dealData.title}</Text>
          </Link>
            <Flex align={"center"} gap="2">
              <Text>Store:</Text>
              <Badge>{storeName}</Badge>
            </Flex>
            <Flex align={"center"} gap="2">
              <Text>Savings:</Text>
              <Badge>{Math.round(dealData.savings)}%</Badge>
            </Flex>
          </Flex>
        </Flex>
        <Flex align={"center"} gap="5">
          <Flex align={"center"} direction={"column"} justify={"center"}>
            <Text size={"5"} style={{textDecoration: "line-through", color: "var(--gray-11"}} >
              ${dealData.normalPrice}
            </Text>
            <Text size={"8"}>
              ${dealData.salePrice}
            </Text>
            { isLoggedIn &&
              <Button 
                size="3" 
                style={{marginTop: 6}}
                onClick={handleAddToWishlist}
                disabled={isLoading}
              >
                {wishlisted ? 'on wishlist' : 'Add to Wishlist'}
              </Button>
            }
          </Flex>
        </Flex>
      </Flex>
    </Section>
  )

}