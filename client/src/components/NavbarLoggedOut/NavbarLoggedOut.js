
import styled from "styled-components";
import { AppBar, Toolbar, Typography, Box, Button } from "@material-ui/core";


function NavbarLoggedOut() {

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="" class="appbar_style">
          <Toolbar>
            <Typography variant="h6" component="div" align="right" sx={{ flexGrow: 1 }} class="logo_MyAnimeArchive">
              <a href="/" style={{ textTransform: "none", color: "inherit" }}>MyAnimeArchive</a>
            </Typography>
            <div style={{ marginLeft: "auto" }}>
              <Button onClick={() => window.location = "/login"} color="inherit" style={{ color: "black", fontFamily: "Verdana,Arial" }}><b>Login</b></Button> &nbsp;
              <Button onClick={() => window.location = "/register"} color="inherit" style={{ color: "black", fontFamily: "Verdana,Arial" }}><b>Sign Up</b></Button>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default NavbarLoggedOut;
