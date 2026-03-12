import { configureStore } from "@reduxjs/toolkit"
import { cheapSharkApi } from "./cheapSharkApi"
import { setupListeners } from "@reduxjs/toolkit/query"


const store = configureStore({
    reducer: {
        [cheapSharkApi.reducerPath]: cheapSharkApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cheapSharkApi.middleware),
})

setupListeners(store.dispatch)

export default store