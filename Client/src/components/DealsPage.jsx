import { Section, Text, Button, Flex, TextField, DropdownMenu, Spinner } from "@radix-ui/themes";
import { Search, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import Deal from "./Deal";
import { useGetDealsQuery, useGetStoresQuery } from "../redux/cheapSharkApi.js";
import { useState, useEffect } from 'react'
import useAuth from "../hooks/useAuth.js";
import useWishlistGames from '../hooks/useWishlistGames'

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
  const { data, error, isLoading, isFetching } = useGetDealsQuery(dealParams, { refetchOnMountOrArgChange: true })
  const deals = data?.deals ?? []
  const totalPages = (data?.totalPages ?? 0) + 1

  const { isLoggedIn } = useAuth()
  
  const { wishlistSet } = useWishlistGames()

  // Stores info.
  const { data: stores = [] } = useGetStoresQuery()
  const storesById = Object.fromEntries(
    stores.map(store => [store.storeID, store.storeName])
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pageNumber])

  return (
    <>
      <Section p="3" style={{backgroundColor: "var(--gray-2)", zIndex: "900", borderBottom: "1px solid var(--gray-4)"}} position="sticky" top={{ initial: "6.5rem", xs: "2rem", sm: "2.5rem" }} width="100%">
        <Flex align="center" style={{ width: "100%" }}>
          <Flex style={{ flex: 1 }} justify="center" gap="4" align="center" wrap="wrap">
            
            <form onSubmit={(e) => {
              e.preventDefault()
              setTitle(draftTitle)
              setPageNumber(0)
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
      ) : isLoading || isFetching ? (
        <Flex gap="4" justify="center" align="center" mt="50px">
          <Spinner size="4" />
          <Text>Loading deals...</Text>
        </Flex>
      ) : deals.length === 0 ? (
        <Text>No deals found.</Text>
      ) : (
        <>
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            {deals.map((deal) => (
              <Deal
                key={deal.dealID}
                dealData={deal}
                storeName={storesById[deal.storeID]}
                isLoggedIn={isLoggedIn}
                wishlisted={wishlistSet.has(String(deal.gameID))}
              />
            ))}
          </div>
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
              onClick={() => setPageNumber(0)}
              disabled={(pageNumber === 0) || isFetching}
            >
              First
            </Button>
            <Button
              onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
              disabled={(pageNumber === 0) || isFetching}
            >
              Previous
            </Button>
            Page {pageNumber+1} of {totalPages}
            <Button
              onClick={() => setPageNumber(Math.min(pageNumber + 1, totalPages - 1))}
              disabled={(pageNumber === totalPages -  1) || isFetching}
            >
              Next
            </Button>
            <Button
              onClick={() => setPageNumber(totalPages - 1)}
              disabled={(pageNumber === totalPages -  1) || isFetching}
            >
              Last
            </Button>
          </Flex>
        </>
      )}
    </>
  )
}