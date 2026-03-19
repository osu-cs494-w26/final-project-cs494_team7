import { Section, Text, Button, Flex, TextField, DropdownMenu } from "@radix-ui/themes";
import { Search, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import Deal from "./Deal";
import { useGetDealsQuery, useGetStoresQuery } from "../redux/cheapSharkApi.js";
import { useState, useMemo } from 'react'
import { useGetWishlistQuery } from "../redux/serverApi.js";
import useAuth from "../hooks/useAuth.js"

const sortByOptions = {
  Savings: "Savings",
  Title: "Title",
  Price: "Price",
  Store: "Store"
}


export default function DealsPage() {
  // Active filter parameters.
  const [pageNumber, setPageNumber] = useState(0);
  const [sortBy, setSortBy] = useState(sortByOptions.Savings);
  const [desc, setDesc] = useState(0);
  const [title, setTitle] = useState("");

  // Draft title state to avoid making a new query on every keystroke.
  const [draftTitle, setDraftTitle] = useState(title);

  const dealParams = {
    pageNumber: pageNumber,
    sortBy: sortBy,
    desc: desc,
    title: title
  }
  const { data, error, isLoading } = useGetDealsQuery(dealParams, { refetchOnMountOrArgChange: true })
  const deals = data?.deals ?? []
  const totalPages = data?.totalPages ?? 1

  // Get wishlist if authorized and create new set.
  const { user, isLoggedIn } = useAuth()
  const { data: wishlist = [] } = useGetWishlistQuery(user, {
    skip: !isLoggedIn
  })
  const wishlistSet = useMemo(() => {
    return new Set(wishlist.map(item => String(item.CheapsharkGameID)))
  }, [wishlist])

  // Stores info.
  const { data: stores = [] } = useGetStoresQuery()
  const storesById = Object.fromEntries(
    stores.map(store => [store.storeID, store.storeName])
  )

  return (
    <>
      <Section p="3" style={{backgroundColor: "var(--gray-2)", zIndex: "900", borderBottom: "1px solid var(--gray-4)"}} position="sticky" top="72px">
        <Flex align="center" style={{ width: "100%" }}>
          <Flex style={{ flex: 1 }} justify="center" gap="4" align="center" wrap="wrap">
            
            <form onSubmit={(e) => {
              e.preventDefault()
              setTitle(draftTitle)
            }}>
              <TextField.Root
                placeholder="Search For Games"
                onChange={(e) => setDraftTitle(e.target.value)}
                value={draftTitle}
              >
                <TextField.Slot>
                  <Search height={"16px"} width={"16px"} />
                </TextField.Slot>
              </TextField.Root>
            </form>
            <Flex align="center" gap="2">
              <Text>Sort:</Text>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="soft">
                    {sortBy}
                    <DropdownMenu.TriggerIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  {Object.values(sortByOptions).map((option) => (
                    <DropdownMenu.Item
                      key={option}
                      onClick={() => setSortBy(option)}
                    >
                      {option}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>

              {/* Direction Toggle */}
              <Button
                variant="soft"
                onClick={() => setDesc(desc === 0 ? 1 : 0)}
              >
                {desc === 0 ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
              </Button>
            </Flex>

          </Flex>
        </Flex>
      </Section>
      {error ? (
          <Text>Could not load deals.</Text>
      ) : isLoading ? (
          <Text>Loading...</Text>
      ) : (
          deals.map((deal) => (
            <Deal
              key={deal.dealID}
              dealData={deal}
              storeName={storesById[deal.storeID]}
              isLoggedIn={isLoggedIn}
              wishlisted={wishlistSet.has(String(deal.gameID))}
            />
          ))
      )}
      <Flex
        align="center"
        justify="center"
        gap="2"
        position="sticky"
        bottom="0"
        p="3"
        style={{backgroundColor: "var(--gray-2)", zIndex: "900", borderTop: "1px solid var(--gray-4)"}}
      >
        <Button
          onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
        >
          Previous Page
        </Button>
        Page {pageNumber+1} of {totalPages+1}
        <Button
          onClick={() => setPageNumber(Math.min(pageNumber +1, totalPages+1))}
        >
          Next Page
        </Button>
      </Flex>
    </>
  )
}