import { useEffect, useRef, useState } from "react";
import { Icons } from "../../assets/icons";

interface SelectedCountryType {
  country: string;
  flag: string;
  language: string;
}

const AppBarLang = () => {
  const DEFAULT_COUNTRY = "United Kingdom";
// @ts-ignore
  const [countries, setCountries] = useState([
    {
      country: "Thailand",
      flag: "https://flagcdn.com/w320/th.png", // URL ของธงประเทศไทย
      language: "thai",
    },
    {
      country: "United Kingdom",
      flag: "https://flagcdn.com/w320/gb.png", // URL ของธงอังกฤษ
      language: "english",
    },
  ]);
  // @ts-ignore
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<SelectedCountryType | null>(null);
  const [isDroplistEnabled, setDroplistEnabled] = useState<boolean>(false);
  const countryLangRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    const defaultCountry = countries.find((country) => country.country === DEFAULT_COUNTRY);
    if (defaultCountry) {
      setSelectedCountry(defaultCountry);
    }
  }, []);

  const countrySelectHandler = (country: string, flag: string, language: string) => {
    setSelectedCountry({ country, flag, language });
    setDroplistEnabled(false);
  };

  const handleDroplistEnable = () => setDroplistEnabled(!isDroplistEnabled);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryLangRef.current && !countryLangRef.current.contains(event.target as Node)) {
        setDroplistEnabled(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="appbar-dropdown lang-dropdown" ref={countryLangRef}>
      <div className="drop-selected" onClick={handleDroplistEnable}>
        <div className="drop-selected-img">
          <img src={selectedCountry?.flag} alt="" />
        </div>
        <div className="drop-selected-text">
          <span>{selectedCountry?.language}</span>
          <img src={Icons.ChevronDownDark} className="drop-icon" alt="" />
        </div>
      </div>
      <div className={`drop-list ${isDroplistEnabled ? "show" : ""}`}>
        {loading ? (
          <div>Data loading ...</div>
        ) : (
          <div className="drop-list-wrapper scrollbar">
            {countries.length > 0 ? (
              countries.map((country) => (
                <div
                  className="drop-item"
                  key={country.country}
                  onClick={() =>
                    countrySelectHandler(country.country, country.flag, country.language)
                  }
                >
                  <span className="drop-item-img">
                    <img src={country.flag} alt="" />
                  </span>
                  <span className="drop-item-text">{country.language}</span>
                </div>
              ))
            ) : (
              <p>No data!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppBarLang;
