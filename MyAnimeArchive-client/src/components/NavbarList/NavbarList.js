import "./NavbarList.css"
import { AppBar, Toolbar, Typography, Box, Button, TextField } from "@material-ui/core";
import { AutoComplete, Row, Col } from 'antd';
import React, { useState } from 'react';
import { find_anime } from "../../services/MyAnimeArchive"
import 'antd/dist/antd.css';

const { Option } = AutoComplete;

function NavbarList() {
    const [result, setResult] = useState([]);

    const handleSearch = async (value) => {
        const response = await find_anime(value)
        setResult([...response.result]);
    };

    const onSelect = (value) => {
        window.location = "/anime/" + value
    };

    return (
        <div className="App">
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="" style={{ background: '#2e51a2', boxShadow: 'none' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" align="right" sx={{ flexGrow: 1 }}>
                            <b><a href="https://www.crunchyroll.com/" class="header_text">Anime</a> &nbsp;
                                <a href="" class="header_text">Community</a> &nbsp;
                                <a href="https://www.crunchyroll.com/videos/anime" class="header_text">Watch</a> &nbsp;
                                <a href="https://www.crunchyroll.com/comics/manga" class="header_text">Read</a> </b>
                        </Typography>
                        <div style={{ marginLeft: "auto" }}>
                            <AutoComplete
                                dropdownMatchSelectHeight={250}
                                style={{
                                    width: 350,
                                    textAlign: "left"
                                }}
                                listHeight="500px"
                                onSearch={handleSearch}
                                onSelect={onSelect}
                                placeholder="Search Anime..."
                            >
                                {result.map((element, index) => (
                                    <Option key={index} value={element[0]}>
                                        <img width="48px" height="auto" src={element[6]}></img>&nbsp;&nbsp;{element[0]}
                                    </Option>
                                ))}
                            </AutoComplete>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    );
}

export default NavbarList;
