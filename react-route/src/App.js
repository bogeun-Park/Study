import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import routes from "./routes/route";

function NavButtons() {
  const navigate = useNavigate();

  const onClickButton = (link) => {
    navigate(link);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>버튼으로 이동:</h3>
      <button onClick={() => onClickButton("/")}>Home</button>
      <button onClick={() => onClickButton("/Map")}>Map</button>
      <button onClick={() => onClickButton("/Shop")}>Shop</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <h2>💻 라우팅 예제</h2>

        <nav>
          <h3>링크로 이동:</h3>
          <ul style={{ display: "flex", gap: "1rem", listStyle: "none", padding: 0 }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Map">Map</Link></li>
            <li><Link to="/Shop">Shop</Link></li>
          </ul>
        </nav>

        <NavButtons />

        <hr />

        <Routes>
          {routes.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
