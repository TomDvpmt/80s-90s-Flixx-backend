import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Box, IconButton, Menu, MenuItem, Avatar } from "@mui/material";

import fetchData from "../utils/fetchData";
import logout from "../utils/logout";
import store from "../utils/store";
import { userSignOut } from "../features/user";
import { selectUserToken } from "../utils/selectors";

const UserMenu = () => {
    const token = useSelector(selectUserToken());

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleAvatarClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleProfileClick = () => {
        navigate("/profile");
        handleClose();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await fetchData(`${process.env.REACT_APP_API_URI}users/logout`, "POST");
        handleClose();
        store.dispatch(userSignOut());
        logout(navigate);
    };

    return (
        <>
            {token && (
                <Box>
                    <IconButton onClick={handleAvatarClick}>
                        <Avatar sx={{ width: "2.5rem", height: "2.5rem" }} />
                    </IconButton>
                    <Menu
                        open={open}
                        onClose={handleClose}
                        anchorEl={anchorEl}
                        transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                        }}
                        anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                        }}>
                        <MenuItem onClick={handleProfileClick}>Profil</MenuItem>
                        <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                    </Menu>
                </Box>
            )}
        </>
    );
};

export default UserMenu;
