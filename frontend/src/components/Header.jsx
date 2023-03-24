import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

import fetchData from "../utils/fetchData";
import logout from "../utils/logout";

import styled from "styled-components";

const StyledHeader = styled.header`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    & nav {
        background-color: #f5f5f5;
        flex-grow: 1;

        & li a {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }
    }
`;

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = async () => {
        await fetchData(`${process.env.REACT_APP_API_URI}users/logout`, "POST");
        logout(navigate);
    };

    return (
        <StyledHeader>
            <img src="" alt="" />
            <p>HEADER</p>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Explorer</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Tableau de bord</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profil</Link>
                    </li>
                    <li>
                        <Link to={token && token !== "null" ? "/" : "/login"}>
                            <FaSignInAlt />
                            Connexion
                        </Link>
                    </li>
                    <li>
                        <Link onClick={handleLogout}>
                            <FaSignOutAlt />
                            Déconnexion
                        </Link>
                    </li>
                    <li>
                        <Link to="/register">
                            <FaUser />
                            Créer un compte
                        </Link>
                    </li>
                </ul>
            </nav>
        </StyledHeader>
    );
};

export default Header;