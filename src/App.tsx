import React from "react";
import "./App.css";
import {
  useGetAllCharactersQuery,
  useGetCharacterByIdQuery,
} from "./features/star-wars-fetching/swFetchingSlice";
import { Character } from "./types/Character";

function App() {
  const [value, setValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenUniqueChar, setIsOpenUniqueChar] = React.useState(false);
  const { data: allCharactersData } = useGetAllCharactersQuery();
  const { data: uniqueCharacterData } = useGetCharacterByIdQuery(value);

  function handleClick() {
    setIsOpen(!isOpen);
  }

  function handleClickUniqueCharacter() {
    setIsOpenUniqueChar(!isOpenUniqueChar);
  }

  React.useEffect(() => {
    setIsOpen(false);
  }, [value]);

  return (
    <div className="App">
      <div>
        <h6>
          Click on the button to display a list of all Star Wars characters
        </h6>
        <button onClick={handleClick}>Display all characters</button>
        {isOpen && allCharactersData ? (
          <div
            style={{
              maxWidth: "100%",
              overflow: "auto",
            }}
          >
            <CharactersTable characters={allCharactersData.results} />
          </div>
        ) : null}

        <h6>
          Enter the id of the character for whom you are searching more details
        </h6>

        <input
          value={value}
          onChange={(e: any) => {
            setValue(e.target.value);
          }}
          onKeyPress={(e: any) => {
            if (e.key === "Enter") {
              setValue(e.target.value);
            }
          }}
        ></input>

        {value ? (
          <button onClick={handleClickUniqueCharacter}>
            See the detailed information
          </button>
        ) : null}

        {isOpenUniqueChar && uniqueCharacterData ? (
          <div style={{ maxWidth: "100%", overflow: "auto" }}>
            <CharactersTable characters={[uniqueCharacterData]} />
          </div>
        ) : null}

        <h6>Characters by Gender : </h6>
        {allCharactersData ? (
          <RelatedCharacters characters={allCharactersData.results} />
        ) : null}
      </div>
    </div>
  );
}

export default App;

function CharactersTable({
  characters,
  cols: colsProp,
}: {
  characters: Character[];
  cols?: string[] | null;
}) {
  const cols = colsProp
    ? colsProp
    : characters && characters.length > 0
    ? Object.keys(characters[0])
    : null;

  return (
    <table
      style={{
        border: "1px solid black",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "black", color: "white" }}>
          {cols?.map((col, index) => {
            return <td key={index}>{col}</td>;
          })}
        </tr>
      </thead>
      <tbody>
        {characters?.map((character, index) => {
          const characterInfos = Object.values(character);

          return (
            <tr
              style={{
                backgroundColor: index % 2 === 0 ? "#E3E3E3" : "",
              }}
              key={index}
            >
              {characterInfos.map((characterInfo: any) => {
                const isStringValue = typeof characterInfo === "string";
                const isArrayValue = Array.isArray(characterInfo);
                return isStringValue ? (
                  <td>{characterInfo}</td>
                ) : isArrayValue ? (
                  <td>
                    {characterInfo.map((valueItem: string) => {
                      return <div>{valueItem}</div>;
                    })}
                  </td>
                ) : null;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function RelatedCharacters({ characters }: { characters: Character[] }) {
  const charsByGenders = characters.reduce((acc: any, value: Character) => {
    if (!acc[value.gender]) {
      acc[value.gender] = [];
    }

    acc[value.gender].push(value);

    return acc;
  }, {});

  const cols = charsByGenders ? Object.keys(charsByGenders) : null;

  return (
    <>
      {cols
        ? Object.values(charsByGenders).map((value: any) => {
            return <CharactersTable characters={value} />;
          })
        : null}
    </>
  );
}
