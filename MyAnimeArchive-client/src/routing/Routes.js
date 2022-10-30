import { Routes, Route } from 'react-router-dom'
import App from "../pages/Homepage/App"
import Signup from "../pages/Signup/Signup"
import Login from "../pages/Login/Login"
import Profile from "../pages/Profile/Profile"
import ViewAnime from "../pages/ViewAnime/ViewAnime"
import AnimeList from "../pages/AnimeList/AnimeList"
import CurrentlyWatching from "../pages/CurrentlyWatching/CurrentlyWatching"
import Completed from "../pages/Completed/Completed"
import AccountSettings from "../pages/AccountSettings/AccountSettings"
import Friends from "../pages/Friends/Friends"
import { LoginProvider } from '../context/LoginContext';

function Routing() {
    return (
        <Routes>
            <Route path="/" element={<LoginProvider><App /></LoginProvider>} />
            <Route path="/register" element={<LoginProvider><Signup /></LoginProvider>} />
            <Route path="/login" element={<LoginProvider><Login /></LoginProvider>} />
            <Route path="/profile/:username" element={<LoginProvider><Profile /></LoginProvider>} />
            <Route path="/anime/:anime" element={<LoginProvider><ViewAnime /></LoginProvider>} />
            <Route path="/animelist/:username" element={<LoginProvider><AnimeList /></LoginProvider>} />
            <Route path="/animelist/currently_watching/:username" element={<LoginProvider><CurrentlyWatching /></LoginProvider>} />
            <Route path="/animelist/completed/:username" element={<LoginProvider><Completed /></LoginProvider>} />
            <Route path="/settings" element={<LoginProvider><AccountSettings /></LoginProvider>} />
            <Route path="/friends" element={<LoginProvider><Friends /></LoginProvider>} />
        </Routes>
    );
}

export default Routing;