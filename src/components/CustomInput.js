import React from "react";
import {FormControl, FormLabel, Input} from "@chakra-ui/react";

const CustomInput = ({formLabel, inputType, isInvalid, onChange, styles }) => {
    return (
      <FormControl isRequired isInvalid={isInvalid}>
          <FormLabel>{formLabel}</FormLabel>
          <Input type={inputType} {...styles} onChange={onChange}/>
      </FormControl>
    );
};

export default CustomInput;
