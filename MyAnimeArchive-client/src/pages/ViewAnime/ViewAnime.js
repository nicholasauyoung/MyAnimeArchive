import './App.css';
import NavbarLoggedOut from "../../components/NavbarLoggedOut/NavbarLoggedOut"
import NavbarLoggedIn from "../../components/NavbarLoggedIn/NavbarLoggedIn"
import NavbarList from "../../components/NavbarList/NavbarList"
import { useLoginContext } from '../../context/LoginContext';
import { useEffect, useState, useCallback } from "react";
import { get_user } from "../../services/MyAnimeArchive"
import { Row, Col, InputNumber } from 'antd';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from "@material-ui/core";
import 'react-multi-carousel/lib/styles.css';
import { useParams } from "react-router-dom";
import { find_anime_one, add_to_list, add_to_favorites } from "../../services/MyAnimeArchive"

function ViewAnime() {

  const { user, set_user, is_logged_in, set_is_logged_in } = useLoginContext();
  let { anime } = useParams();
  const [number_episodes, set_number_episodes] = useState(0);
  const [progress, set_progress] = useState(0);
  const [score, set_score] = useState(0);
  const [img_anime, set_img_anime] = useState("");
  const [genre_list, set_genre_list] = useState("")

  useEffect(async () => {
    const token = localStorage.getItem('session_id');
    if (token) {
      const response = await get_user(token)
      if (!response.Error) {
        set_is_logged_in(true)
        set_user(response.user)
      }
    }
    const res_anime = await find_anime_one(anime)
    if (res_anime.result) {
      set_img_anime(res_anime.result[0][6].replace('t.jpg', '.jpg'))
      set_number_episodes(res_anime.result[0][1])
      let genres = JSON.parse(res_anime.result[0][5].replace('t.jpg', '.jpg'))
      var temp_genre_list = ""
      for (const property in genres) {
        temp_genre_list += genres[property] + ", "
      }
      set_genre_list(temp_genre_list)
    }
  }, [])

  const update_list = useCallback(async () => {
    const response = await add_to_list(user, localStorage.getItem('session_id'), score, progress, anime)
    if (response.result == "Logged out") {
      localStorage.removeItem('session_id');
      set_is_logged_in(false)
    }
  }, [user, progress, anime, score]);

  const add_favorites = useCallback(async () => {
    const response = await add_to_favorites(user, localStorage.getItem('session_id'), anime)
    if (response.result == "Favorite Added") {
      alert("Added to favorites")
    }
  }, [user, anime]);

  function onChange(value) {
    set_progress(value)
  }

  function onChangeScore(value) {
    set_score(value)
  }

  return (
    <div className="App">
      {is_logged_in == true && (
        <NavbarLoggedIn />
      )}
      {is_logged_in == false && (
        <NavbarLoggedOut />
      )}
      <NavbarList />

      <section id="seasonal title" style={{ color: "black", fontFamily: "Verdana,Arial", fontSize: "18px", textAlign: "left", backgroundColor: "#e1e7f5" }}>
        &nbsp;<b>{anime}</b>
        <div class="hl"><hr></hr></div>
      </section>
      <Row>
        <Col span={5}>
          <img src={img_anime} width="80%"></img>
          <br />
          <br />
          <div style={{textAlign:"right"}}>
          <Button onClick={add_favorites} style={{ background: 'transparent', color: 'black', fontFamily: "Verdana,Arial", textTransform: "none"}}>Add to Favorites</Button>
          <br/><br/>
          Episodes Seen: <InputNumber min={0} max={number_episodes} onChange={onChange} /> /{number_episodes}<br/>
          Score: <InputNumber min={0} max={10} onChange={onChangeScore} /> /10<br/>
          <Button onClick={update_list} style={{ background: '#2e51a2', color: 'white', fontFamily: "Verdana,Arial", textTransform: "none", marginTop:"5px"}}>Update</Button>
          </div>
        </Col>
        <Col span={1}>
          <div class="vl"></div>
        </Col>
        <Col span={18}>
          <div class="textDefault"><b>Genres:</b> {genre_list}</div>
        </Col>
      </Row>

    </div >
  );
}

export default ViewAnime;
