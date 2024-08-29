import { IdContext } from "./context";
import { useState } from "react";

const IdContextProvider = ({ children }) => {
    const [userId, setUserId] = useState(-1);
    const [library, setLibrary] = useState([]);
    const value = { userId, setUserId,library,setLibrary};
  
    return (
      <IdContext.Provider value={ value }>
        {children}
      </IdContext.Provider>
    );
  }

export default IdContextProvider;