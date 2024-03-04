import { useEffect, useState } from "react";

export default function App() {
  const [query, setQuery] = useState("india");
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  // const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  // const avgUserRating = average(watched.map((movie) => movie.userRating));
  // const avgRuntime = average(watched.map((movie) => movie.runtime));

  useEffect(
    function () {
      if (query.length < 3) return;

      // setIsLoading(true);
      async function getCountries() {
        try {
          setIsLoading(true);
          const response = await fetch(
            `https://restcountries.com/v3.1/translation/${query}`
          );
          if (!response.ok) throw new Error("Country Not Found");

          const data = await response.json();
          if (data.Response === "False") throw new Error("Country Not Found !");
          setCountries(data);
          console.log(data);
          setIsLoading(false);
        } catch (err) {
          console.error(err.message);
          setLoadingMessage(err.messgae);
        }
      }
      getCountries();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <Result countries={countries} />
      </NavBar>
      <Main>
        <Box>
          {isLoading ? (
            <Loader loaderMessage={loadingMessage} />
          ) : (
            <CountryList countries={countries} />
          )}
          {/* <CountryList countries={countries} /> */}
        </Box>
        <Box>
          <Summary />
        </Box>
      </Main>
    </>
  );
}

function Loader({ loaderMessage }) {
  return (
    <div className="loader">
      <h2>{loaderMessage}</h2>
    </div>
  );
}
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Country Visulization</h1>
    </div>
  );
}

function SearchBar({ query, setQuery }) {
  // const [query, setQuery] = useState();
  return (
    <input
      className="search"
      type="text"
      placeholder="Search countries..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Result({ countries }) {
  return (
    <p className="num-results">
      Found <strong>{countries.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {" "}
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function CountryList({ countries }) {
  return (
    <ul className="list">
      {countries?.map((country, index) => (
        <Country country={country} key={index} />
      ))}
    </ul>
  );
}

function Country({ country }) {
  return (
    <li key={country.imdbID}>
      <img src={country.flags.png} alt={`${country.Title} poster`} />
      <h3>{country.name.common}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{country.population}</span>
        </p>
      </div>
    </li>
  );
}

function Summary() {
  return (
    <div className="summary">
      <h2>Click on the country to get detail</h2>
      <div>
        <p>
          <span>#️⃣</span>
          {/* <span>{watched.length} movies</span> */}
        </p>
        <p>
          <span>⭐️</span>
          {/* <span>{avgImdbRating}</span> */}
        </p>
        <p>
          <span>🌟</span>
          {/* <span>{avgUserRating}</span> */}
        </p>
        <p>
          <span>⏳</span>
          {/* <span>{avgRuntime} min</span> */}
        </p>
      </div>
    </div>
  );
}
