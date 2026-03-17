import { useGetSessionQuery } from "../redux/serverApi";

export default function useAuth() {
    const { data } = useGetSessionQuery()
    return {
        user: data,
        isLoggedIn: !!data
    }
}