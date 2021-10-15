import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Link,
    Spinner,
    Text,
    useColorMode
} from '@chakra-ui/react';
import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import CustomInput from "./CustomInput";
import NetworkList from "./NetworkList";

const ConfigurationArea = () => {
    const [networks, setNetworks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();

    const cleanNetworks = (networks) => {
        const unique = (value, index, self) => {
            const findIndex = (element) => element.ssid === value.ssid;
            return self.findIndex(findIndex) === index;
        };

        return networks.filter(unique);
    };

    useEffect(() => {
        fetch('http://192.168.4.1/api/networks', {
            method: 'GET',
            redirect: 'follow',
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                setNetworks(cleanNetworks(data || []));
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
                setError(err);
            });
    }, []);

    return (
        <Flex minHeight='100vh' width='full' align='center' justifyContent='center'>
            <Box
                borderWidth={1}
                px={4}
                width='full'
                maxWidth='500px'
                borderRadius={4}
                textAlign='center'
                boxShadow='lg'
            >
                <ThemeSelector/>
                <Box p={4}>
                    <ConfigurationHeader/>
                    { isLoading && <Spinner size="xl" mt={12}/>}
                    { error &&  <CustomError message={error.message}/> }
                    { !isLoading && !error && <ConfigurationPanel networks={networks}/> }
                </Box>
            </Box>
        </Flex>
    )
}

const CustomError = ({message}) => {
    return (
        <>
            <Text color="red" mt={5}>{message || "Unexpected error. Try rebooting and refreshing."}</Text>
        </>
    )
}

const ThemeSelector = () => {
    const {colorMode, toggleColorMode} = useColorMode()

    return (
        <Box textAlign='right' py={4}>
            <IconButton
                icon={colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                onClick={toggleColorMode}
                variant='ghost'
                aria-label='Change color mode'/>
        </Box>
    )
}

const ConfigurationHeader = () => {
    return (
        <Box textAlign='center'>
            <Heading>Configuration firmware</Heading>
            <Text mt={3}>
                Developed with &hearts; for <Link color={`teal.500`} href="https://www.uninorte.edu.co/">Uninorte</Link>
            </Text>
        </Box>
    )
}

const ConfigurationPanel = ({networks}) => {
    // Form values
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [password, setPassword] = useState('');

    // Invalid states
    const [invalidFields, setInvalidFields] = useState({});

    const onSubmit = () => {
        const connectionData = {
            deviceName,
            selectedNetwork,
            password,
        }

        let numberErrors = 0;

        for (let connectionDataKey in connectionData) {
            const isInvalid = connectionData[connectionDataKey] === '';
            numberErrors += isInvalid;
            setInvalidFields((prevState) => {
                return {
                    ...prevState,
                    [connectionDataKey]: isInvalid,
                };
            });
        }

        if (numberErrors > 0) return;

        const url = `http://192.168.4.1/api/configuration?device_name=${deviceName}&ssid=${selectedNetwork}&password=${password}`;
        uploadSettings(url);
    }

    const uploadSettings = (url) => {
        fetch(url, {
            method: 'POST',
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <Box my={8} textAlign='left'>
            <form>
                <CustomInput inputType="text" formLabel="Device name"
                             styles={{mb: 4, placeholder: "uninorte_expofisica"}}
                             onChange={(e) => setDeviceName(e.target.value)} isInvalid={invalidFields.deviceName}/>

                <NetworkList networks={networks} formLabel="Select the SSID to connect"
                             onChange={(e) => setSelectedNetwork(e.target.value)}
                             isInvalid={invalidFields.selectedNetwork}/>

                <CustomInput inputType="password" formLabel="Password"
                             styles={{mb: 4, placeholder: "******"}}
                             onChange={(e) => setPassword(e.target.value)} isInvalid={invalidFields.password}/>

                <Button colorScheme="teal" width='full' mb={2} mt={4} onClick={onSubmit}>Connect</Button>
            </form>
        </Box>
    )
}

export default ConfigurationArea;
