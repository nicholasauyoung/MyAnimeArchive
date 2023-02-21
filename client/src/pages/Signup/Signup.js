import './Signup.css';
import NavbarLoggedOut from "../../components/NavbarLoggedOut/NavbarLoggedOut"
import NavbarLoggedIn from "../../components/NavbarLoggedIn/NavbarLoggedIn"
import NavbarList from "../../components/NavbarList/NavbarList"
import { useLoginContext } from '../../context/LoginContext';
import { useEffect, useState, useCallback } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Grid, TextField } from "@material-ui/core";
import { makeStyles } from '@material-ui/core';
import { sign_up } from "../../services/MyAnimeArchive"


function Signup() {
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
  const { user, set_user, is_logged_in, set_is_logged_in } = useLoginContext();
  const [username, set_username] = useState('');
  const [password, set_password] = useState('');
  const [confirm_password, set_confirm_password] = useState('');
  const classes = useStyles();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (password != confirm_password)
      alert("Password and Confirmed Password must be the same.")
    const response = await sign_up(username, password, confirm_password)
    if (response.result == "User registered") {
      alert("You may now login")
      window.location = "/login"
    }
  }, [username, password, confirm_password]);

  useEffect(async () => {
    const token = localStorage.getItem('session_id');
    if (token) {
      set_is_logged_in(true)
    }
  }, [])

  return (
    <div className="App">
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
        <TextField
          label="Confirm Password"
          variant="filled"
          type="password"
          required
          value={confirm_password}
          onChange={e => set_confirm_password(e.target.value)}
        />
        <div>
          <Button type="submit" variant="contained" color="primary">
            Sign up
          </Button>
        </div>
      </form>

    </div>
  );
}

export default Signup;
