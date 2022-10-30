import * as React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from "@material-ui/core";
import { useLoginContext } from '../../context/LoginContext';
import { useEffect, useState, useCallback } from "react";
import { logout } from "../../services/MyAnimeArchive"
import "./NavbarLoggedIn.css"

function NavbarLoggedIn() {
  const { user, set_user, is_logged_in, set_is_logged_in } = useLoginContext();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout_user = useCallback(async () => {
    const response = await logout(user, localStorage.getItem('session_id'))
    if (response.result == "Logged out") {
      localStorage.removeItem('session_id');
      set_is_logged_in(false)
      window.location = "/"
    }
  }, [user]);

  const go_to_profile = useCallback(async () => {
    window.location = "/profile/" + user
  }, [user]);

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="" class="appbar_style">
          <Toolbar>
            <Typography variant="h6" component="div" align="right" sx={{ flexGrow: 1 }} class="logo_MyAnimeArchive">
              <a href="/" style={{ textTransform: "none", color: "inherit" }}>MyAnimeArchive</a>
            </Typography>
            <div style={{ marginLeft: "auto" }}>
              <Button onClick={()=> window.location="/friends"}><i class="fa fa-envelope-o" aria-hidden="true"></i></Button>
              <Button onClick={handleMenu} className="text_navbar" style={{ color: "black", fontFamily: "Verdana,Arial", fontSize: "20px" }}><b>{user}</b> &nbsp; <i class="fa fa-caret-down"></i></Button><img height="30px" src="/MyAnimeArchiveIcon.png"></img>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                keepMounted
                getContentAnchorEl={null}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={go_to_profile}>Profile</MenuItem>
                <MenuItem onClick={() => window.location = "/settings"}>Account Settings</MenuItem>
                <MenuItem onClick={logout_user}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default NavbarLoggedIn;
