import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Icons } from "../../assets/icons";
import { REST_COUNTRIES_API_URL } from "../../constants/apiUrl";

interface CountryType {
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
  languages: {
    [key: string]: string;
  };
}

interface SelectedCountryType {
  country: string;
  flag: string;
  language: string;
}

const AppBarLang = () => {
  const DEFAULT_COUNTRY = "United States";

  const [countries, setCountries] = useState<CountryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<SelectedCountryType | null>(null);
  const [isDroplistEnabled, setDroplistEnabled] = useState<boolean>(false);
  const countryLangRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await axios.get(REST_COUNTRIES_API_URL);
        const sortedCountries: CountryType[] = response.data.sort((a: CountryType, b: CountryType) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);

        const defaultCountry = sortedCountries.find(
          (country) => country?.name?.common === DEFAULT_COUNTRY
        );

        if (defaultCountry) {
          const langKey = Object.keys(defaultCountry.languages)[0];
          setSelectedCountry({
            country: defaultCountry.name.common,
            flag: defaultCountry.flags.png,
            language: langKey,
          });
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchCountryData();
  }, []);

  const countrySelectHandler = (country: string, flag: string, language: string) => {
    setSelectedCountry({ country, flag, language });
    setDroplistEnabled(false);
  };

  const handleDroplistEnable = () => setDroplistEnabled(!isDroplistEnabled);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryLangRef.current &&
        !countryLangRef.current.contains(event.target as Node)
      ) {
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
            {countries?.length > 0 ? (
              countries.map((country) => {
                if (country?.languages && Object.keys(country.languages).length > 0) {
                  const langKey = Object.keys(country.languages)[0];
                  return (
                    <div
                      className="drop-item"
                      key={country.name.common}
                      onClick={() =>
                        countrySelectHandler(
                          country.name.common,
                          country.flags.png,
                          langKey
                        )
                      }
                    >
                      <span className="drop-item-img">
                        <img src={country.flags.png} alt="" />
                      </span>
                      <span className="drop-item-text">{langKey}</span>
                    </div>
                  );
                }
                return null;
              })
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
