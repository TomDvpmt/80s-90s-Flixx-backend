import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import UserMenu from "../../components/UserMenu";

import {
    selectUserIsSignedIn,
    selectUserUsername,
} from "../../services/utils/selectors";

import { Box, AppBar, Toolbar, Button, Typography } from "@mui/material";
import theme from "../../assets/styles/theme";

const NavBar = () => {
    const isSignedIn = useSelector(selectUserIsSignedIn());
    const username = useSelector(selectUserUsername());

    return (
        <AppBar
            component="div"
            position="sticky"
            sx={{
                backgroundColor: theme.palette.primary.light,
            }}>
            <Toolbar
                component="nav"
                sx={{
                    flexGrow: 1,
                    maxWidth: theme.maxWidth.nav,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                <Box>
                    <Button component={NavLink} to="/" sx={{ color: "white" }}>
                        Explorer
                    </Button>
                    {isSignedIn && (
                        <Button
                            component={NavLink}
                            to="/dashboard"
                            sx={{ color: "white" }}>
                            Mon tableau de bord
                        </Button>
                    )}
                    {!isSignedIn && (
                        <>
                            <Button
                                component={NavLink}
                                to="/login"
                                sx={{ color: "white" }}>
                                Se connecter
                            </Button>
                            <Button
                                component={NavLink}
                                to="/register"
                                sx={{ color: "white" }}>
                                Créer un compte
                            </Button>
                        </>
                    )}
                </Box>

                {isSignedIn && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography component="span" color="white">
                            {username}
                        </Typography>
                        <UserMenu />
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
