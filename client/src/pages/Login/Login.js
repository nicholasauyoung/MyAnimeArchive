import NavbarLoggedOut from "../../components/NavbarLoggedOut/NavbarLoggedOut"
import NavbarLoggedIn from "../../components/NavbarLoggedIn/NavbarLoggedIn"
import NavbarList from "../../components/NavbarList/NavbarList"
import { useLoginContext } from '../../context/LoginContext';
import { useEffect, useState, useCallback } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from '@material-ui/core';
import { login, get_user } from "../../services/MyAnimeArchive"


function Login() {
  const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(2),

      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '300px',
      },
      '& .MuiButtonBase-root': {
        margin: theme.spacing(2),
      },
    },
  }));

  useEffect(async () => {
    const token = localStorage.getItem('session_id');
    if (token) {
      const response = await get_user(token)
      if (!response.Error)
      {
      set_is_logged_in(true)
      set_user(response.user)
      window.location = "/"
      }
    }
  }, [])

  const { user, set_user, is_logged_in, set_is_logged_in } = useLoginContext();
  const [username, set_username] = useState('');
  const [password, set_password] = useState('');
  const classes = useStyles();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const response = await login(username, password)
    if (response.result != "Invalid credentials")
    {
      localStorage.setItem('session_id', response.result);
      set_is_logged_in(true)
      window.location = "/"
    }
  }, [username, password]);

  useEffect(async () => {
    const token = localStorage.getItem('session_id');
    if (token) {
      set_is_logged_in(true)
    }
  }, [])

  return (
    <div className="App">
      <NavbarLoggedOut></NavbarLoggedOut>
      <form className={classes.root} onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="filled"
          required
          value={username}
          onChange={e => set_username(e.target.value)}
        />
        <TextField
          label="Password"
          variant="filled"
          type="password"
          required
          value={password}
          onChange={e => set_password(e.target.value)}
        />
        <div>
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </div>
      </form>

    </div>
  );
}

export default Login;
