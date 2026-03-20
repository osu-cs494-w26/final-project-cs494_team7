import { Flex } from "@radix-ui/themes"
import { Outlet } from "react-router"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function AppLayout() {
    return (
        <Flex direction="column" minHeight={"100vh"}>
            <Navbar />
            <main style={{ flexGrow: 1}}>
                <Outlet />
            </main>
            <Footer />
        </Flex>
    )
}