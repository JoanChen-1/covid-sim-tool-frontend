import React from 'react';
import { Typography, Grid } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
const useStyles = makeStyles((theme) =>({
    title:{
        textAlign: 'center',
        fontWeight: 'bold',
        gutterBottom: true,
        fontSize: theme.typography.h3.fontSize
    },
    widerOption: {
        width: 1000,
    },
    narrowerOption: {
      width: 300,
    },
    settingContainer: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
  }));

export default function DiseaseSetting (props){
    const { 
        handleRChange,
        handleRatiosChange,
        icu_admission,
        hospotalization,
        fatality
    } = props;
    const classes = useStyles();
    const age_gp = ['0-19歲','20-44歲','45-54歲','55-64歲','65-74歲', '75-84歲', '85歲+'];
    const r0_marks = [
        {
            value: 3,
            label: '3'
        },
        {
            value: 4,
            label: '4'
        },
        {
            value: 5,
            label: '5'
        },
        {
            value: 6,
            label: '6'
        },
      ];
      const ratio_marks = [
        {
            value: 0,
            label: '0%'
        },
        {
            value: 100,
            label: '100%'
        },
      ];
    

    const handleR = (e, value) =>{
        handleRChange(value);
    }

    const handleRatios = (key, idx) => (e, value) =>{
        handleRatiosChange(key, idx, value);
    }
    return(
        <>
            <div className={classes.settingContainer}>
                <Typography className={classes.title}  gutterBottom>
                    疾病相關設定
                </Typography>
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                >
                    <Grid item xs={3}>
                        <Typography variant='h5' gutterBottom >
                            R0 value
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Slider
                            aria-labelledby="slider-r"
                            valueLabelDisplay="auto"
                            step={1}
                            marks={r0_marks}
                            min={3}
                            max={6}
                            defaultValue={3}
                            onChangeCommitted={handleR}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant='h6' gutterBottom>
                            病毒基本再生數，指1個感染到某種傳染病的人，會把疾病傳染給其他多少個人的平均數。
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <Grid container flexGrow={1} spacing={2}>
                <Grid item xs={4}>
                    <div className={classes.narrowerOption}>
                        <Typography variant='h5' gutterBottom >
                            各年齡層重症率<br/>
                        </Typography>
                            {icu_admission.map((ratio, idx) =>(
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    key={idx}
                                >
                                    <Grid item xs={3}>
                                        <Typography>
                                            {age_gp[idx]}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Slider
                                            defaultValue={ratio}
                                            valueLabelDisplay="auto"
                                            marks={ratio_marks}
                                            step={0.5}
                                            min={0}
                                            max={100}
                                            onChangeCommitted={handleRatios('icu', idx)}
                                        />                                       
                                    </Grid>
                                </Grid>
                            ))}
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div className={classes.narrowerOption}>
                        <Typography variant='h5' gutterBottom >
                            各年齡層住院率<br/>
                        </Typography>
                        {hospotalization.map((ratio, idx) =>(
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                key={idx}
                            >
                                <Grid item xs={3}>
                                    <Typography>
                                        {age_gp[idx]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Slider
                                        defaultValue={ratio}
                                        valueLabelDisplay="auto"
                                        marks={ratio_marks}
                                        step={0.5}
                                        min={0}
                                        max={100}
                                        onChangeCommitted={handleRatios('hospital', idx)}
                                    />                                       
                                </Grid>
                            </Grid>
                        ))}
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div className={classes.narrowerOption}>
                        <Typography variant='h5' gutterBottom >
                            各年齡層死亡率<br/>
                        </Typography>
                        {fatality.map((ratio, idx) =>(
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                key={idx}
                            >
                                <Grid item xs={3}>
                                    <Typography>
                                        {age_gp[idx]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Slider
                                        defaultValue={ratio}
                                        valueLabelDisplay="auto"
                                        marks={ratio_marks}
                                        step={0.5}
                                        min={0}
                                        max={100}
                                        onChangeCommitted={handleRatios('fatality', idx)}
                                    />                                       
                                </Grid>
                            </Grid>
                        ))}
                    </div>
                </Grid>
            </Grid>
        </>
    )
}