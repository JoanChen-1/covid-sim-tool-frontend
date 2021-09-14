import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box  
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
    appBar: {
        boxShadow: theme.shadows[6],
        backgroundColor: theme.palette.primary.main,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        [theme.breakpoints.down("xs")]: {
          width: "100%",
          marginLeft: 0,
        },
      },
      appBarToolbar: {
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
        },
        [theme.breakpoints.up("md")]: {
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
        },
        [theme.breakpoints.up("lg")]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4),
        },
      },
      title:{
        color: theme.palette.common.white
      }
  }));
export default function NavBar() {
    const classes = useStyles();
    const [version, setVersion] = useState(10);
    
    const handleChange = (event) => {
      console.log("version value: ", event.target.value);
      setVersion(event.target.value);
    };
    return (
        <AppBar position="sticky" className={classes.appBar}>
            <Toolbar className={classes.appBarToolbar}>
                <Typography 
                    variant="h5" 
                    align='center'
                    className={classes.title}
                >
                    台灣Covid-19疾病模擬系統
                </Typography>
                <Select
                  value={version}
                  onChange={handleChange}
                  label="Version"
                >
                  <MenuItem value={10}>Version 1.0</MenuItem>
                  <MenuItem value={20}>Version 1.1</MenuItem>
                </Select>
            </Toolbar>
        </AppBar>
    )
}
