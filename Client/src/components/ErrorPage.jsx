import { useRouteError } from 'react-router';


export default function ErrorPage() {
    const error = useRouteError();
    
    let errorMessage = "Well that wasn't supposed to happen.."
    if(error) {
        errorMessage = error.statusText || error.message
    }
    return (
        <>
            <div className='errorPage'>
                <h1>Error!</h1>
                <p>{errorMessage}</p>
            </div>
        </>
    )
}