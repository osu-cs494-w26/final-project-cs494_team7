import { Section, Text, Button, Flex, Dialog, TextField } from "@radix-ui/themes";
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

  // Draft filter state.
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftSortBy, setDraftSortBy] = useState(sortBy);
  const [draftDesc, setDraftDesc] = useState(desc);

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

  function applyFilters() {
    setPageNumber(0);
    setTitle(draftTitle);
    setSortBy(draftSortBy);
    setDesc(draftDesc);
  }

  function resetDraftFilters() {
    setDraftTitle("");
    setDraftSortBy(sortByOptions.Savings);
    setDraftDesc(0);
  }

  return (
    <>
      <Section p="3" style={{backgroundColor: "var(--gray-2)"}}>
        <Flex align="center" style={{ width: "100%" }}>
          <Flex style={{ flex: 1 }} justify="start">
            <Dialog.Root>
              <Dialog.Trigger>
                <Button color={"bronze"}>Filter Deals</Button>
              </Dialog.Trigger>

              <Dialog.Content maxWidth="450px">
                <Dialog.Title>Filter Deals</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                  Adjust your deal filters.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Title
                    </Text>
                    <TextField.Root
                      defaultValue=""
                      placeholder="Enter a title to search"
                      onChange={(e) => setDraftTitle(e.target.value)}
                    />
                  </label>

                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Sort By
                    </Text>
                    <select
                      value={draftSortBy}
                      onChange={(e) => setDraftSortBy(e.target.value)}
                    >
                      {Object.values(sortByOptions).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Direction
                    </Text>
                    <select
                      value={draftDesc}
                      onChange={(e) => setDraftDesc(Number(e.target.value))}
                    >
                      <option value={0}>Descending</option>
                      <option value={1}>Ascending</option>
                    </select>
                  </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button
                      variant="soft"
                      color="gray"
                      onClick={resetDraftFilters}
                    >
                      Close
                    </Button>
                  </Dialog.Close>

                  <Dialog.Close>
                    <Button onClick={applyFilters}>Apply Filters</Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          </Flex>
        </Flex>
      </Section>
      {error ? (
          <li>Oh no, there was an error</li>
      ) : isLoading ? (
          <li>Loading...</li>
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
      <Flex align="center" justify="center" style={{margin: 20}} gap="2">
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