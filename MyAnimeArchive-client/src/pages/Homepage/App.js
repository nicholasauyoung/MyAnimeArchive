import './App.css';
import NavbarLoggedOut from "../../components/NavbarLoggedOut/NavbarLoggedOut"
import NavbarLoggedIn from "../../components/NavbarLoggedIn/NavbarLoggedIn"
import NavbarList from "../../components/NavbarList/NavbarList"
import { useLoginContext } from '../../context/LoginContext';
import { useEffect, useState, useCallback } from "react";
import { get_user, get_list } from "../../services/MyAnimeArchive"
import { Row, Col } from 'antd';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function App() {

  const { user, set_user, is_logged_in, set_is_logged_in } = useLoginContext();
  const [watch_count, set_watch_count] = useState("");
  const [complete_count, set_complete_count] = useState("");
  const [num_episodes_total, set_num_episodes_total] = useState(0);
  const [anime_total, set_anime_total] = useState(0);

  useEffect(async () => {
    const token = localStorage.getItem('session_id');
    if (token) {
      const response = await get_user(token)
      if (!response.Error) {
        set_is_logged_in(true)
        set_user(response.user)
        const response_list = await get_list(user)
        if (response_list.anime_list) {
          var completed_count = 0
          var watching_count = 0
          var num_eps = 0
          var total = 0
          for (const property in response_list.anime_list) {
            total += 1
            num_eps += response_list.anime_list[property]["Progress"]
            if (response_list.anime_list[property]["Progress"] == response_list.anime_list[property]["Number_Episodes"]) {
              completed_count += 1
            }
            else {
              watching_count += 1
            }
          }
          set_anime_total(total)
          set_num_episodes_total(num_eps)
          set_complete_count(completed_count)
          set_watch_count(watching_count)
        }
      }
    }
  }, [user])

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 10
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3
    }
  };

  const responsiveMostPopular = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <div className="App">
      {is_logged_in == true && (
        <NavbarLoggedIn />
      )}
      {is_logged_in == false && (
        <NavbarLoggedOut />
      )}
      <NavbarList />

      <Row>
        <Col span={18}>
          <section id="seasonal title" style={{ color: "black", fontFamily: "Verdana,Arial", fontSize: "18px", textAlign: "left" }}>
            &nbsp;<b>Winter 2022 Anime</b>
            <div class="hl"><hr></hr></div>
          </section>
          <Carousel responsive={responsive}>
            <img src="https://cdn.myanimelist.net/r/160x220/images/anime/1948/120625.webp?s=9506e41a8e1dbdb24d0715dd70c7fd47"></img>
            <img src="https://cdn.myanimelist.net/r/160x220/images/anime/1908/120036.webp?s=0e0d3fa6f6025db846916ffdd36e5672"></img>
            <img src="https://cdn.myanimelist.net/r/160x220/images/anime/1179/119897.webp?s=c528b334ca44e93f3fd40fc5d59cb5f4"></img>
            <img src="https://cdn.myanimelist.net/r/160x220/images/anime/1446/118840.webp?s=95980cd8eebb536afbc391fdb732f3aa"></img>
            <img src="https://cdn.myanimelist.net/r/160x220/images/anime/1247/120579.webp?s=13749c38608539ea22ffdfefbc2b707d"></img>
            <img src="https://cdn.myanimelist.net/r/160x220/images/anime/1263/119511.webp?s=92bf8068d3fdb322036e507622867f77"></img>
            <img src="https://cdn.myanimelist.net/r/160x220/images/anime/1088/120068.webp?s=e8fc354c1543507509680e916330c1b2"></img>
          </Carousel>
          <br />
          <section id="Most Popular Anime Trailers" style={{ color: "black", fontFamily: "Verdana,Arial", fontSize: "18px", textAlign: "left" }}>
            &nbsp;<b>Most Popular Anime Trailers</b>
            <div class="hl"><hr></hr></div>
          </section>
          <Carousel responsive={responsiveMostPopular}>
            <div>
              <iframe width="420" height="315"
                src="https://www.youtube.com/embed/KKzmOh4SuBc?enablejsapi=1&wmode=opaque&autoplay=0">
              </iframe>
              <div style={{ color: "black", fontFamily: "Verdana,Arial" }}>Shingeki no Kyojin</div>
            </div>
            <div>
              <iframe width="420" height="315"
                src="https://www.youtube.com/embed/4TrEY9Zs_FQ?enablejsapi=1&wmode=opaque&autoplay=0">
              </iframe>
              <div style={{ color: "black", fontFamily: "Verdana,Arial" }}>Death Note</div>
            </div>
            <div>
              <iframe width="420" height="315"
                src="https://www.youtube.com/embed/--IcmZkvL0Q?enablejsapi=1&wmode=opaque&autoplay=0">
              </iframe>
              <div style={{ color: "black", fontFamily: "Verdana,Arial" }}>Fullmetal Alchemist: Brotherhood</div>
            </div>
            <div>
              <iframe width="420" height="315"
                src="https://www.youtube.com/embed/6Bdb1V0Io_g?enablejsapi=1&wmode=opaque&autoplay=0">
              </iframe>
              <div style={{ color: "black", fontFamily: "Verdana,Arial" }}>One Punch Man</div>
            </div>
          </Carousel>
        </Col>
        <Col span={1}>
          <div class="vl"></div>
        </Col>
        <Col span={5}>
          <br />
          <div style={{ textAlign: "left", fontFamily: "Verdana,Arial" }}>
            {is_logged_in == true && (
              <div>
                <b>
                  My Statistics </b>
                <hr></hr>
                Anime Entries	{anime_total}
                <br />
                Currently Watching {watch_count}
                <br />
                Completed {complete_count}
                <br />
                Episodes Watched {num_episodes_total}
                <br /><br />
              </div>
            )}
            <b>
              Top Airing Anime </b>
            <hr></hr>
            <Row>
              <Col span={11}>
                <img src="https://cdn.myanimelist.net/r/160x220/images/anime/1948/120625.webp?s=9506e41a8e1dbdb24d0715dd70c7fd47" width="100px" height="auto"></img>
              </Col>
              <Col span={13}>
                Shingeki no Kyojin: The Final Season Part 2
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={11}>
                <img src="https://cdn.myanimelist.net/images/anime/1347/117616.jpg" width="100px" height="auto"></img>
              </Col>
              <Col span={13}>
                Ousama Ranking
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={11}>
                <img src="https://cdn.myanimelist.net/images/anime/6/73245.jpg" width="100px" height="auto"></img>
              </Col>
              <Col span={13}>
                One Piece
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

    </div >
  );
}

export default App;
