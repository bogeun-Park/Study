import Home from "../page/home";
import Map from "../page/map";
import Shop from "../page/shop";

const routes = [
    { path: "/", element: <Home /> },
    { path: "/about", element: <Map /> },
    { path: "/shop", element: <Shop /> },
];

export default routes;