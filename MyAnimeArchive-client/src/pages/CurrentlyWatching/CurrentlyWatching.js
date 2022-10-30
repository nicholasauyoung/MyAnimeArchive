import './App.css';
import { useLoginContext } from '../../context/LoginContext';
import { useEffect, useState, useCallback } from "react";
import { get_user } from "../../services/MyAnimeArchive"
import { Row, Col, Progress } from 'antd';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Paper, Table, TableHead, TableContainer, TableRow, TableCell, TableBody } from "@material-ui/core";
import 'react-multi-carousel/lib/styles.css';
import { useParams } from "react-router-dom";
import { get_list } from "../../services/MyAnimeArchive"

function CurrentlyWatching() {

  const { user, set_user, is_logged_in, set_is_logged_in } = useLoginContext();
  let { username } = useParams();
  const [list_anime, set_list_anime] = useState([]);

  useEffect(async () => {
    const token = localStorage.getItem('session_id');
    if (token) {
      const response = await get_user(token)
      if (!response.Error) {
        set_is_logged_in(true)
        set_user(response.user)
      }
    }
    var temp_anime_list = []
    const response_list = await get_list(username)
    for (const property in response_list.anime_list) {
      if (response_list.anime_list[property]["Progress"] != response_list.anime_list[property]["Number_Episodes"]) {
        temp_anime_list[property] = response_list.anime_list[property]
      }
    }
    set_list_anime(temp_anime_list)
  }, [])

  function go_to_anime(element) {
    const url = "/anime/" + element;
    return url
  }

  function anime_list_all() {
    const url = "/animelist/" + username;
    return url
  }

  function anime_list_cw() {
    const url = "/animelist/currently_watching/" + username;
    return url
  }

  function anime_list_completed() {
    const url = "/animelist/completed/" + username;
    return url
  }

  return (
    <div className="App">

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="" class="appbar_style">
          <Toolbar>
            <Typography variant="h6" component="div" align="right" sx={{ flexGrow: 1 }} class="logo_MyAnimeArchive">
              <a href="/" style={{ textTransform: "none", color: "inherit" }}>MyAnimeArchive</a>
            </Typography>
            <div style={{ marginLeft: "auto" }}>
              {username == user && (
                <div style={{ fontFamily: "Verdana,Arial", fontSize: "18px" }}>Viewing your Anime List</div>
              )}
              {username != user && (
                <div style={{ fontFamily: "Verdana,Arial", fontSize: "18px" }}>Viewing {username}'s Anime List</div>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </Box>

      <Row>
        <Col span={3}>

        </Col>
        <Col span={18}>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="" class="appbar_style" style={{ backgroundColor: "black", alignItems: "center" }}>
              <Toolbar>
                <Typography align="right" variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ width: "100%", alignItems: "center" }} align="center" class="textDefaultCenter">
                  <a href={anime_list_all()} style={{ textTransform: "none", color: "white" }}><b>All Anime</b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <a href={anime_list_cw()} style={{ textTransform: "none", color: "white" }}><b>Currently Watching</b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <a href={anime_list_completed()} style={{ textTransform: "none", color: "white" }}><b>Completed</b></a>
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>
        </Col>
        <Col span={3}>

        </Col>
      </Row>

      <Row>
        <Col span={3}>

        </Col>
        <Col span={18}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align="left">Image</TableCell>
                  <TableCell align="left">Anime Title</TableCell>
                  <TableCell align="left">Score</TableCell>
                  <TableCell align="left">Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(list_anime).map((element, index) => (
                  <TableRow
                    key={index}
                  >
                    <TableCell component="th" scope="row">
                      {index}
                    </TableCell>
                    <TableCell align="left"> <img src={list_anime[element]["thumbnail"].replace('t.jpg', '.jpg')} width="50px"></img></TableCell>
                    <TableCell align="left"><a href={go_to_anime(element)}>{element} </a></TableCell>
                    <TableCell align="left">
                      {list_anime[element]["Score"] == 0 && (
                        <div>-</div>
                      )}
                      {list_anime[element]["Score"] != 0 && (
                        <div>{list_anime[element]["Score"]}</div>
                      )}
                    </TableCell>
                    <TableCell align="left">{list_anime[element]["Progress"]}/{list_anime[element]["Number_Episodes"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Col>
        <Col span={3}>

        </Col>
      </Row>
    </div >
  );
}

export default CurrentlyWatching;
