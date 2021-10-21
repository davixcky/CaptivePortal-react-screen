import React from "react";
import {FormControl, FormLabel, Select} from "@chakra-ui/react";

const NetworkList = ({networks, formLabel, isInvalid, isDisabled, onChange}) => {
    return (
        <FormControl isRequired isInvalid={isInvalid} isDisabled={isDisabled}>
            <FormLabel>{formLabel}</FormLabel>
            <Select placeholder="Select Network" mb={4} onChange={onChange}>
                {
                    networks.map(({ssid}) => {
                        return <option value={ssid} key={ssid}> {ssid} </option>
                    })
                }
            </Select>
        </FormControl>
    )
};

export default NetworkList;
