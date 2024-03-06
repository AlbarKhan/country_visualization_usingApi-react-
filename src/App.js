import { useEffect, useState } from "react";

export default function App() {
  const [query, setQuery] = useState("india");
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [selectedId, setSelectedId] = useState("");

  // const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  // const avgUserRating = average(watched.map((movie) => movie.userRating));
  // const avgRuntime = average(watched.map((movie) => movie.runtime));

  function handleSelectedCountry(name) {
    setSelectedId(name);
  }

  useEffect(
    function () {
      // setIsLoading(true);
      const controller = new AbortController();
      async function getCountries() {
        if (query.length < 3) return;
        try {
          setIsLoading(true);
          const response = await fetch(
            `https://restcountries.com/v3.1/translation/${query}`,
            { signal: controller.signal }
          );
          if (!response.ok) throw new Error("Country Not Found");

          const data = await response.json();
          if (data.Response === "False") throw new Error("Country Not Found !");
          setCountries(data);
          // console.log(data);
          setIsLoading(false);
        } catch (err) {
          // console.error(err.message);
          setLoadingMessage(err.message);
          // console.log("checkh");
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
            <CountryList
              countries={countries}
              OnSelect={handleSelectedCountry}
            />
          )}
          {/* <CountryList countries={countries} /> */}
        </Box>
        <Box>
          <Summary />
          {selectedId ? <CountryDetail selectedCountry={selectedId} /> : ""}
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

function CountryList({ countries, OnSelect }) {
  return (
    <ul className="list">
      {countries?.map((country, index) => (
        <Country country={country} key={index} OnSelect={OnSelect} />
      ))}
    </ul>
  );
}

function Country({ country, OnSelect }) {
  return (
    <li key={country.imdbID} onClick={() => OnSelect(country.name.common)}>
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
    </div>
  );
}

function CountryDetail({ selectedCountry }) {
  // https://restcountries.com/v3.1/name/aruba?fullText=true  by name
  const [country, setCountry] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      console.log(selectedCountry);
      async function getCountry() {
        setIsLoading(true);
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${selectedCountry}?fullText=true`
        );
        const data = await response.json();
        console.log(...data);
        setCountry(...data);
        console.log(country);
        setIsLoading(false);
        // console.log(lat);
        // lat = country.capitalInfo?.latlng[0];
      }
      getCountry();
    },
    [selectedCountry]
  );
  return (
    <div>
      {isLoading ? (
        <Loader loaderMessage={"Loading..."} />
      ) : (
        <div className="details">
          {/* <header>
            <img src={country.flags?.png} alt="ll"></img>
            https://www.google.co.in/maps/@19.0578688,72.8498176,12z?entry=ttu
            {country?.capitalInfo?.latlng[0]}
          </header> */}
          <header>
            <img
              src={country.flags?.png}
              alt={`Poster of ${country.flags?.alt} movie`}
            ></img>
            <div className="details-overview">
              <h2>{country.name?.common} </h2>
              <p>Continent: {country.region}</p>
              <p>
                <a
                  href={`https://www.google.co.in/maps/@${country?.capitalInfo?.latlng[0]},${country?.capitalInfo?.latlng[1]},12z?entry=ttu`}
                  className="map-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  Capital : {country.capital}
                </a>
              </p>
              <p>Population : {country.population}</p>
              {/* <p>
                {" "}
                Currencies : ( {country.currencies?.INR?.symbol} )
                {country.currencies?.INR?.name}
              </p> */}
              <p>
                Location :
                <a
                  href={country.maps?.googleMaps}
                  target="_blank"
                  rel="noreferrer"
                  className="map-link"
                >
                  Click here to open map
                </a>
              </p>
              {/* <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p> */}
            </div>
          </header>
          <section>
            {/* <p>
              <em>
                Currencies : ( {country.currencies?.INR?.symbol} )
                {country.currencies?.INR.name}
              </em>
            </p> */}
            <p>Starring {country.region}</p>
            <p>Directed by {country.region}</p>
            <p></p>
            <p>
              Location :
              <a
                href={country.maps?.googleMaps}
                target="_blank"
                rel="noreferrer"
                className="map-link"
              >
                Click here to open map
              </a>
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
