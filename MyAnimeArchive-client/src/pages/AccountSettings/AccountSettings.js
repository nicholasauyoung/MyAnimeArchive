import './App.css';
import { useLoginContext } from '../../context/LoginContext';
import { useEffect, useState, useCallback } from "react";
import { get_user } from "../../services/MyAnimeArchive"
import { Row, Col, Input } from 'antd';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Paper, Table, TableHead, TableContainer, TableRow, TableCell, TableBody } from "@material-ui/core";
import 'react-multi-carousel/lib/styles.css';
import { useParams } from "react-router-dom";
import { get_list, update_bio } from "../../services/MyAnimeArchive"
import NavbarLoggedIn from "../../components/NavbarLoggedIn/NavbarLoggedIn"
import NavbarList from "../../components/NavbarList/NavbarList"
const { TextArea } = Input;

function AccountSettings() {

  const { user, set_user, is_logged_in, set_is_logged_in } = useLoginContext();
  let { username } = useParams();
  const [list_anime, set_list_anime] = useState([]);
  const [new_bio, set_new_bio] = useState("");

  const bio = useCallback(async () => {
    const response = await update_bio(user, localStorage.getItem('session_id'), new_bio)
    if (response.result == "Updated Bio") {
      window.location.reload();
    }
  }, [new_bio, user]);

  useEffect(async () => {
    const token = localStorage.getItem('session_id');
    if (token) {
      const response = await get_user(token)
      if (!response.Error) {
        set_is_logged_in(true)
        set_user(response.user)
      }
    }
    const response_list = await get_list(username)
    if (response_list.anime_list) {
      set_list_anime(response_list.anime_list)
    }
  }, [])

  function go_to_anime(element) {
    const url = "/anime/" + element;
    return url
  }

  return (
    <div className="App">

      <NavbarLoggedIn/>
      <NavbarList/>
      <Row>
        <Col span={3}>
          <br/>
          <div class="textDefaultCenter">About Me</div>
        </Col>
        <Col span={18}>
          <br/>
          <TextArea rows={4} onChange={e => set_new_bio(e.target.value)}/>
          <Button onClick={bio} style={{background: '#2e51a2', color: 'white', fontFamily: "Verdana,Arial", textTransform: "none", marginTop:"5px"}}>Submit</Button>
        </Col>
        <Col span={3}>

        </Col>
      </Row>
    </div >
  );
}

export default AccountSettings;
