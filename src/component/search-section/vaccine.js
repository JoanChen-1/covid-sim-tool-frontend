import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Switch, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles((theme) =>({
    root: {
        width: "90px",
        height: "50px",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      track: {
        width: "40px",
        height: "20px",
        borderRadius: "10px",
      },
      switchBase: {
        "&$checked": {
          transform: "translateX(40px)",
        },
        "& + $track": {
          backgroundColor: "rgba(0,125,129,0.3)",
        },
      },
      checked: {},
      thumb: {
        width: "32px",
        height: "32px",
        transform: "translateX(0px)",
      }
  }));

export default function Vaccine(props){
    const classes = useStyles();
    const {
        handleIsVaccineChange, 
        handleVaccineBrandChange, 
        handleVaccineDoseChange,
        handleVaccineStrategyChange} = props;

    const [vaccine, setVaccine] = useState(false);
    const [brand, setBrand] = useState('A');
    const [strategy, setStrategy] = useState('1');
    const [dose, setDose] = useState('10M');

    const handleVaccineBrand = (e, value) => {
        setBrand(value);
        handleVaccineBrandChange(value)
    };
    const handleVaccineDose = (e, value) => {
        setDose(value);
        handleVaccineDoseChange(value);
    };
    const handleVaccineStrategy = (e, value) => {
        setStrategy(value);
        handleVaccineStrategyChange(value);
    };
    const handleVaccineChange = () => {
        handleIsVaccineChange(vaccine === true? false: true);
        setVaccine(vaccine === true? false: true);
    };

    return(
        <>
            <Typography id="discrete-slider" variant='h5' gutterBottom >
                疫苗施打
            </Typography>
            <Typography component="div">
                <Grid component="label" container pacing={1}>
                    <Grid item>Off</Grid>
                        <Grid item>
                            <Switch
                                checked={vaccine}
                                onChange={handleVaccineChange}
                                name="vaccine-check"
                                classes={{
                                    root: classes.root,
                                    switchBase: classes.switchBase,
                                    thumb: classes.thumb,
                                    track: classes.track,
                                    checked: classes.checked,
                                }}
                                inputProps={{ 'aria-label': 'checkbox with default color' }}
                            />
                        </Grid>
                    <Grid item>On</Grid>
                </Grid>
            </Typography>
            <Collapse in={vaccine}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                        <FormLabel component="legend">疫苗廠牌</FormLabel>
                        <RadioGroup aria-label="vaccine-brand" name="vaccine-brand" value={brand} onChange={handleVaccineBrand}>
                            <FormControlLabel disabled={!vaccine} value="A" control={<Radio />} label="AZ：間隔週數8週" />
                            <FormControlLabel disabled={!vaccine} value="B" control={<Radio />} label="莫德納：間隔週數8週" />
                        </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                        <FormLabel component="legend">疫苗施打總量</FormLabel>
                        <RadioGroup row aria-label="vaccine-dose" name="vaccine-dose" value={dose} onChange={handleVaccineDose}>
                            <FormControlLabel disabled={!vaccine} value="10M" control={<Radio />} label="1000萬劑" />
                            <FormControlLabel disabled={!vaccine} value="20M" control={<Radio />} label="2000萬劑" />
                            <FormControlLabel disabled={!vaccine} value="30M" control={<Radio />} label="3000萬劑" />
                            <FormControlLabel disabled={!vaccine} value="40M" control={<Radio />} label="4000萬劑" />
                        </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                        <FormLabel component="legend">疫苗施打方式</FormLabel>
                        <RadioGroup row aria-label="vaccine-strategy" name="vaccine-strategy" value={strategy} onChange={handleVaccineStrategy}>
                            <FormControlLabel disabled={!vaccine} value="1" control={<Radio />} label="每天施打十萬劑疫苗" />
                            <FormControlLabel disabled={!vaccine} value="2" control={<Radio />} label="每天施打二十萬劑疫苗" />
                        </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </Collapse>
        </>
    )
}