import React from "react";
import { Navbar, Button, Link, Text, Card, Spacer, Radio, useTheme, } from "@nextui-org/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';


export default function App() {
  const [variant, setVariant] = React.useState("default");
  const [activeColor, setActiveColor] = React.useState("primary");

  const {isDark} = useTheme();

  const variants = [
    "default",
    "highlight",
    "highlight-solid",
    "underline",
    "highlight-rounded",
    "highlight-solid-rounded",
    "underline-rounded",
  ];

  const colors = ["primary", "secondary", "success", "warning", "error"];
  
  return (
 
      <Navbar isBordered={isDark} variant="sticky">
        <Navbar.Brand>
          <a href="https://genesisx50.com/" target="_blank">
          <Text b color="inherit" hideIn="xs">
            Genesis x50
          </Text>
          </a>
        </Navbar.Brand>
        <Navbar.Content activeColor={activeColor} hideIn="xs" variant={variant}>
          
        </Navbar.Content>
        <Navbar.Content>
         
          <Navbar.Item>
            <ConnectButton />
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>      
    
  )
}
