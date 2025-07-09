import { Link } from "react-router-dom"

export const Logo = () => {
    return (
        <Link to="/">
            <img
                src="/images/lifeguard-2.svg" alt="lifeguard logo"
                className="logo"
            />
        </Link>
    )
}