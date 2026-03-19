import { useParams } from 'react-router'

export default function PublicWishlistPage() {
    const { username } = useParams()
    return (
        <div>
            <h1>{username}'s Wishlist</h1>
        </div>
    )
}