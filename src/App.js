import React from 'react'
import {
    theme,
    ChakraProvider
} from '@chakra-ui/react'
import {ConfigurationArea} from "./components";


const App = () => {
    return (
        <ChakraProvider thene={theme}>
            <ConfigurationArea/>
        </ChakraProvider>
    )
}



export default App;
