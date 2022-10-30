import axios from 'axios';

const headers = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const sign_up = async (user, password, confirm_password) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/register_user`, {
        username: user,
        password: password,
        confirm_password: confirm_password
    }, headers);

    responseData = await response.data;

    return responseData;
};

export const login = async (user, password) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/login`, {
        username: user,
        password: password,
    }, headers);

    responseData = await response.data;

    return responseData;
};

export const logout = async (user, session_id) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/logout`, {
        username: user
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': session_id
        }
    });

    responseData = await response.data;

    return responseData;
};

export const update_bio = async (user, session_id, bio) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/update_bio`, {
        username: user,
        bio: bio
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': session_id
        }
    });

    responseData = await response.data;

    return responseData;
};

export const accept_friend = async (user, session_id) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/accept_friend`, {
        username: user
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': session_id
        }
    });

    responseData = await response.data;

    return responseData;
};

export const remove_friend = async (user, session_id) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/remove_friend`, {
        username: user
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': session_id
        }
    });

    responseData = await response.data;

    return responseData;
};


export const add_friend = async (user, session_id) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/add_friend`, {
        username: user
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': session_id
        }
    });

    responseData = await response.data;

    return responseData;
};

export const add_to_list = async (user, session_id, score, progress, anime) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/insert`, {
        username: user,
        score: score,
        progress: progress,
        anime: anime
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': session_id
        }
    });

    responseData = await response.data;

    return responseData;
};

export const add_to_favorites = async (user, session_id, anime) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/add_to_favorite`, {
        username: user,
        anime: anime
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': session_id
        }
    });

    responseData = await response.data;

    return responseData;
};

export const get_user = async (session_id) => {

    let responseData = null;
    const response = await axios.get(`${process.env.REACT_APP_SERVER}/user`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': session_id
        }
    });

    responseData = await response.data;

    return responseData;
};

export const find_anime = async (query) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/find_anime`, {
        query: query
    }, headers);

    responseData = await response.data;

    return responseData;
};

export const find_anime_one = async (query) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/find_anime_one`, {
        query: query
    }, headers);

    responseData = await response.data;

    return responseData;
};

export const get_list = async (user) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/list`, {
        username: user
    }, headers);

    responseData = await response.data;

    return responseData;
};

export const get_user_data = async (user) => {
    let responseData = null;

    const response = await axios.post(`${process.env.REACT_APP_SERVER}/user_data`, {
        username: user
    }, headers);

    responseData = await response.data;

    return responseData;
};

