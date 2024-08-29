import { createContext } from 'react';


const IdContext = createContext({
    userId: -1,
    setUserId: () => {},
    library: [],
    setLibrary: () => {}
});



export { IdContext };