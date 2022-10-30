import './App.css';
import { useLoginContext } from '../../context/LoginContext';
import { useEffect, useState, useCallback } from "react";
import { get_user } from "../../services/MyAnimeArchive"
import { Row, Col, Input } from 'antd';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Paper, Table, TableHead, TableContainer, TableRow, TableCell, TableBody } from "@material-ui/core";
import 'react-multi-carousel/lib/styles.css';
import { useParams } from "react-router-dom";
import { get_list, update_bio, get_user_data, accept_friend, remove_friend } from "../../services/MyAnimeArchive"
import NavbarLoggedIn from "../../components/NavbarLoggedIn/NavbarLoggedIn"
import NavbarList from "../../components/NavbarList/NavbarList"
const { TextArea } = Input;

function Friends() {

  const { user, set_user, is_logged_in, set_is_logged_in } = useLoginContext();
  const [list_friends, set_list_friends] = useState([]);
  const [list_friends_pending, set_list_list_friends_pending] = useState([]);

  const friend_req = useCallback(async (friend_name) => {
    const response = await accept_friend(friend_name, localStorage.getItem('session_id'))
    if (response.result == "Friend request accepted") {
      window.location.reload();
    }
  }, [user]);

  const decline_req = useCallback(async (friend_name) => {
    const response = await remove_friend(friend_name, localStorage.getItem('session_id'))
    if (response.result == "Deleted") {
      window.location.reload();
    }
  }, [user]);

  useEffect(async () => {
    const token = localStorage.getItem('session_id');
    if (token) {
      const response = await get_user(token)
      if (!response.Error) {
        set_is_logged_in(true)
        set_user(response.user)
      }
    }
    const response_user_data = await get_user_data(user)
    var temp_pending = []
    var temp_fl = []
    for (const property in response_user_data.result.friends) {
      if (response_user_data.result.friends[property] == false) {
        temp_pending.push(property)
      }
      else {
        temp_fl.push(property)
      }
    }
    set_list_friends(temp_fl)
    set_list_list_friends_pending(temp_pending)
  }, [user])

  return (
    <div className="App">

      <NavbarLoggedIn />
      <NavbarList />
      <Row>
        <Col span={3}>
          <br />
          <div class="textDefaultCenter">Friend Requests</div>
        </Col>
        <Col span={18} style={{ textAlign: "left" }}>
          <br />
          {list_friends_pending.map((element, index) => (
            <div className="textDefaultCenter">{element} 
            &nbsp;<Button onClick={()=>friend_req(element)} style={{ background: '#2e51a2', color: 'white', fontFamily: "Verdana,Arial", textTransform: "none", fontSize:"13px" }}>Accept</Button>
            &nbsp;<Button onClick={()=>decline_req(element)} style={{ background: '#2e51a2', color: 'white', fontFamily: "Verdana,Arial", textTransform: "none", fontSize:"13px" }}>Decline</Button>
            </div>
          ))}
        </Col>
        <Col span={3}>

        </Col>
      </Row>
      <Row>
        <Col span={3}>
          <br />
          <div class="textDefaultCenter">Friends</div>
        </Col>
        <Col span={18} style={{ textAlign: "left" }}>
          <br />
          {list_friends.map((element, index) => (
            <div className="textDefaultCenter">{element} 
            </div>
          ))}
        </Col>
        <Col span={3}>

        </Col>
      </Row>
    </div >
  );
}

export default Friends;
