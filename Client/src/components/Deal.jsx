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
      <Flex 
        justify="between" 
        align={{ initial: 'flex-start', sm: 'center' }}
        direction={{ initial: 'column', xs: 'row' }}
        gap={{ initial: '3', sm: '4' }}
      >
        <Flex 
          align={{ initial: 'flex-start', sm: 'center' }} 
          gap={{ initial: '2', sm: '6' }}
          style={{ minWidth: 0, flex: 1 }}
        >
          {/* <Menu /> */}
          <div style={{
            width: "140px",
            minWidth: "140px",
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
          <Flex direction="column" gap={{ initial: '1', sm: '2' }}>
          <Link
            href={`https://www.cheapshark.com/redirect?dealID=${dealData.dealID}`}
            target="_blank"
            rel="noopener noreferrer"
          >
          <Text size={{ initial: '4', xs: '5', sm: '7' }}>{dealData.title}</Text>
          </Link>
            <Flex align={"center"} gap="2">
              <Text size={{ initial: '1', xs: '2', sm: '3' }}>Store:</Text>
              <Badge>{storeName}</Badge>
            </Flex>
            <Flex align={"center"} gap="2">
              <Text size={{ initial: '1', xs: '2', sm: '3' }}>Savings:</Text>
              <Badge>{Math.round(dealData.savings)}%</Badge>
            </Flex>
          </Flex>
        </Flex>
        <Flex 
          align={{ initial: 'flex-start', sm: 'center' }} 
          gap={{ initial: '2', sm: '6' }}
          justify="center"
        >
          <Flex align={"center"} direction={"column"} justify={"center"}>
            <Text size={{ initial: '4', sm: '5' }} style={{textDecoration: "line-through", color: "var(--gray-11"}} >
              ${dealData.normalPrice}
            </Text>
            <Text size={{ initial: '4', sm: '5' }}>
              ${dealData.salePrice}
            </Text>
            { isLoggedIn &&
              <Button 
                size={{ initial: '2', sm: '3' }}
                style={{marginTop: 6}}
                onClick={handleAddToWishlist}
                disabled={isLoading}
              >
                {wishlisted ? 'On Wishlist' : 'Add to Wishlist'}
              </Button>
            }
          </Flex>
        </Flex>
      </Flex>
    </Section>
  )

}