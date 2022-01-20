import './App.css';
import React, { useContext, useState } from 'react';


// Context used solely for transferring knowledge of which cities are selected
// from dropdown to WeatherList
const selectionContext = React.createContext({
  selection: "Kaikki kaupungit",
  setSelection: () => { },
});

// Cities to be picked from, first option is all cities because this structure
// is fed directly into the dropdown menu. Could be done otherwise.
const cities = [
  "Kaikki kaupungit",
  "Helsinki",
  "Jyväskylä",
  "Kuopio",
  "Tampere",
];

function App() {
  //const [selection, setSelection] = useState(cities[0]);
  //const value = { selection, setSelection };
  
  return (
    <div className="App">
              <div className="App-header">
      <h2> Hello, Sailor!</h2>

    </div>
    <selectionContext.Provider value={{
  selection: "Kaikki kaupungit",
  setSelection: () => { },
}}>
      <ContextCheck/>
    </selectionContext.Provider>
    </div>
  );
}


const ContextCheck = () => {
  const value = useContext(selectionContext);
  //const [selection, setSelection] = useContext(selectionContext);
  return (
    <div>
      <p>Current selection as according to context: {value.selection}</p>
      </div>
  )
}
export default App;
