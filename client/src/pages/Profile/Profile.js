import './App.css';
import NavbarLoggedOut from "../../components/NavbarLoggedOut/NavbarLoggedOut"
import NavbarLoggedIn from "../../components/NavbarLoggedIn/NavbarLoggedIn"
import NavbarList from "../../components/NavbarList/NavbarList"
import { useLoginContext } from '../../context/LoginContext';
import { useEffect, useState, useCallback } from "react";
import { get_user } from "../../services/MyAnimeArchive"
import { Row, Col, Progress } from 'antd';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from "@material-ui/core";
import 'react-multi-carousel/lib/styles.css';
import { useParams } from "react-router-dom";
import { get_list, get_user_data, add_friend } from "../../services/MyAnimeArchive"
import styled from 'styled-components';

const StyledButton = styled(Button)({
  '&.Mui-disabled': {
    backgroundColor: '#808080',
  },
  background: '#2e51a2',
  "&:hover": {
    backgroundColor: "#2e51a2"
  }
});

function Profile() {

  const { user, set_user, is_logged_in, set_is_logged_in } = useLoginContext();
  let { username } = useParams();
  const [bio, setBio] = useState("");
  const [watch_count, set_watch_count] = useState("");
  const [complete_count, set_complete_count] = useState("");
  const [num_episodes_total, set_num_episodes_total] = useState(0);
  const [most_recent_1, set_most_recent_1] = useState([]);
  const [most_recent_2, set_most_recent_2] = useState([]);
  const [loading, set_loading] = useState(true);
  const [list_friends, set_list_friends] = useState([]);
  const [favorite_anime, set_favorite_anime] = useState([]);

  useEffect(async () => {
    const token = localStorage.getItem('session_id');
    if (token) {
      const response = await get_user(token)
      if (!response.Error) {
        set_is_logged_in(true)
        set_user(response.user)
      }
      const response_list = await get_list(username)
      if (response_list.anime_list) {
        var completed_count = 0
        var watching_count = 0
        var num_eps = 0
        for (const property in response_list.anime_list) {
          console.log(response_list.anime_list[property]["Progress"])
          num_eps += response_list.anime_list[property]["Progress"]
          if (response_list.anime_list[property]["Progress"] == response_list.anime_list[property]["Number_Episodes"]) {
            completed_count += 1
          }
          else {
            watching_count += 1
          }
        }
        set_num_episodes_total(num_eps)
        set_complete_count(completed_count)
        set_watch_count(watching_count)
      }
      const response_data = await get_user_data(username)
      if (response_data.result) {
        setBio(response_data.result.bio)
        set_favorite_anime(response_data.result.favorites)
        var recent_updates_anime = response_data.result.recent
        try {
          if (recent_updates_anime[recent_updates_anime.length - 1] != undefined)
            set_most_recent_1(recent_updates_anime[recent_updates_anime.length - 1])
          if (recent_updates_anime[recent_updates_anime.length - 2] != undefined)
            set_most_recent_2(recent_updates_anime[recent_updates_anime.length - 2])
        } catch (error) {

        }

        var temp_fl = []
        for (const property in response_data.result.friends) {
          if (response_data.result.friends[property] != false && temp_fl.length < 10) {
            temp_fl.push(property)
          }
        }
        set_list_friends(temp_fl)
      }
    }
    set_loading(false)
  }, [])

  const add_to_friends_list = useCallback(async () => {
    const response = await add_friend(username, localStorage.getItem('session_id'))
    if (response.result == "Friend request sent") {
      alert("Friend request sent to " + username)
    }
  }, [username]);

  return (
    <div className="App">
      {loading == false && (
        <div>
          {is_logged_in == true && (
            <NavbarLoggedIn />
          )}
          {is_logged_in == false && (
            <NavbarLoggedOut />
          )}
          <NavbarList />

          <section id="seasonal title" style={{ color: "black", fontFamily: "Verdana,Arial", fontSize: "18px", textAlign: "left", backgroundColor: "#e1e7f5" }}>
            &nbsp;<b>{username}'s Profile</b>
            <div class="hl"><hr></hr></div>
          </section>
          <Row>
            <Col span={5}>
              <img src="/MyAnimeArchiveIcon.png"></img>
              <br /> <br />
              <Button onClick={() => window.location = "/animelist/" + username} style={{ background: '#2e51a2', color: 'white', fontFamily: "Verdana,Arial", textTransform: "none" }}>Anime List</Button>
              &nbsp;&nbsp;<StyledButton disabled={username == user} onClick={add_to_friends_list} style={{ color: 'white', fontFamily: "Verdana,Arial", textTransform: "none" }}>
                Request</StyledButton>
              <br /> <br />
              <div class="textDefault"><b >&nbsp;&nbsp;Friends</b></div>
              <div class="hl"><hr></hr></div>
              <Row style={{ textAlign: "left" }}>
                {list_friends.map((element, index) => (
                  <Col className="textDefaultCenter" style={{ textAlign: "center" }}>
                    <img src="/MyAnimeArchiveIcon.png" width="50px"></img>
                    <br />
                    {element}
                  </Col>
                ))}
              </Row>
            </Col>
            <Col span={1}>
              <div class="vl"></div>
            </Col>
            <Col span={18}>
              <div>
                {bio == "" && (
                  <div class="textDefault">No biography yet. <a href="/settings">Write it now.</a></div>)}
                {bio != "" && (
                  <div class="textDefault">{bio}</div>)}
              </div>
              <br />
              &nbsp;<div class="textDefault"><b >Statistics</b></div>
              <div class="hl"><hr></hr></div>
              <Row>
                <Col span={11}>
                  &nbsp;<div class="textDefault">Anime Stats</div>
                  <div class="hl"><hr></hr></div>
                  <div class="textDefault">Days: <b>{(num_episodes_total * 22 / 1440).toFixed(2)} </b></div>
                  <Progress percent={Number(complete_count / (complete_count + watch_count)) * 100} status="active" showInfo={false} />
                  <div class="textDefault"><span class="dot" style={{ backgroundColor: "green" }}></span>&nbsp;Watching: {watch_count}</div>
                  <div class="textDefault"><span class="dot" style={{ backgroundColor: "blue" }}></span>&nbsp;Completed: {complete_count}</div>
                </Col>
                <Col span={1}>
                </Col>
                <Col span={11}>
                  &nbsp;<div class="textDefault">Last Anime Updates</div>
                  <div class="hl"><hr></hr></div>
                  {most_recent_1.length != 0 && (
                    <Row>
                      <Col span={5}>
                        <img src={most_recent_1["thumbnail"].replace('t.jpg', '.jpg')} width="80%"></img>
                      </Col>
                      <Col span={1}>
                      </Col>
                      <Col span={18}>
                        <div style={{ textAlign: "left" }}>
                          {most_recent_1["Anime_Name"]}
                          <Progress percent={Number(most_recent_1["Progress"] / most_recent_1["Number_Episodes"]) * 100} status="active" showInfo={false} />
                          {most_recent_1["Progress"] == most_recent_1["Number_Episodes"] && (
                            <div>Completed {most_recent_1["Progress"]}/{most_recent_1["Number_Episodes"]} Scored {most_recent_1["Score"]}</div>
                          )}
                          {most_recent_1["Progress"] != most_recent_1["Number_Episodes"] && (
                            <div>Watching {most_recent_1["Progress"]}/{most_recent_1["Number_Episodes"]} Scored {most_recent_1["Score"]}</div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  )}
                  {most_recent_2.length != 0 && (
                    <div>
                      <br />
                      <Row>
                        <Col span={5}>
                          <img src={most_recent_2["thumbnail"].replace('t.jpg', '.jpg')} width="80%"></img>
                        </Col>
                        <Col span={1}>
                        </Col>
                        <Col span={18}>
                          <div style={{ textAlign: "left" }}>
                            {most_recent_2["Anime_Name"]}
                            <Progress percent={Number(most_recent_2["Progress"] / most_recent_2["Number_Episodes"]) * 100} status="active" showInfo={false} />
                            {most_recent_2["Progress"] == most_recent_2["Number_Episodes"] && (
                              <div>Completed {most_recent_2["Progress"]}/{most_recent_2["Number_Episodes"]} Scored {most_recent_2["Score"]}</div>
                            )}
                            {most_recent_2["Progress"] != most_recent_2["Number_Episodes"] && (
                              <div>Watching {most_recent_2["Progress"]}/{most_recent_2["Number_Episodes"]} Scored {most_recent_2["Score"]}</div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </Col>
              </Row>
              &nbsp;<div class="textDefault"><b >Favorites</b></div>
              <div class="hl"><hr></hr></div>
              &nbsp;<div class="textDefault">Anime ({Object.keys(favorite_anime).length})</div>
              <Row>
                {Object.keys(favorite_anime).map((element, index) => (
                  <Col><img src={favorite_anime[element]["thumbnail"].replace('t.jpg', '.jpg')} height="350px"></img>
                    <br />
                    <div class="textDefaultCenter">
                      {element}
                    </div></Col>
                ))}
              </Row>
              {/* <Row>
                <Col span={11}>
                  &nbsp;<div class="textDefault">Manga Stats</div>
                  <div class="hl"><hr></hr></div>
                  <div class="textDefault">Days: <b>0</b></div>
                  <Progress percent={100} status="active" showInfo={false} />
                  <div class="textDefault"><span class="dot" style={{ backgroundColor: "green" }}></span>&nbsp;Reading: 0</div>
                  <div class="textDefault"><span class="dot" style={{ backgroundColor: "blue" }}></span>&nbsp;Completed: 0</div>
                </Col>
                <Col span={1}>
                </Col>
                <Col span={11}>
                  &nbsp;<div class="textDefault">Last Manga Updates</div>
                  <div class="hl"><hr></hr></div>
                </Col>
              </Row> */}
            </Col>
          </Row>
        </div>
      )}
    </div >
  );
}

export default Profile;
