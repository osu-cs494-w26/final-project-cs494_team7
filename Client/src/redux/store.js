import { configureStore } from "@reduxjs/toolkit"
import { cheapSharkApi } from "./cheapSharkApi"
import { serverApi } from "./serverApi"
import { setupListeners } from "@reduxjs/toolkit/query"


const store = configureStore({
    reducer: {
        [cheapSharkApi.reducerPath]: cheapSharkApi.reducer,
        [serverApi.reducerPath]: serverApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(cheapSharkApi.middleware)
            .concat(serverApi.middleware),
})

setupListeners(store.dispatch)

export default store