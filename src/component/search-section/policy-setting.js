import React from 'react';
import { Typography, Grid } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Vaccine from './vaccine';

const useStyles = makeStyles((theme) =>({
    title:{
        textAlign: 'center',
        fontWeight: 'bold',
        gutterBottom: true,
        fontSize: theme.typography.h3.fontSize
    },
    widerOption: {
        width: 1200,
    },
    narrowerOption: {
      width: 300,
    },
    settingContainer: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
  }));

export default function PolicySetting (props){
    const {
        percentage_20_marks,
        handleMaskChange,
        handleDistanceChange,
        handleWashChange,
        handleIsVaccineChange,
        handleVaccineBrandChange,
        handleVaccineDoseChange,
        handleVaccineStrategyChange
    } = props;
    const classes = useStyles();

    const handleMask = (e, value) =>{
        handleMaskChange(value);
    }
    const handleDistance = (e, value) =>{
        handleDistanceChange(value);
    }
    const handleWash = (e, value) =>{
        handleWashChange(value);
    }

    return(
        <div className={classes.settingContainer}>
            <Typography className={classes.title} gutterBottom>
                政策相關設定
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <div className={classes.narrowerOption}>
                        <Typography variant='h5' gutterBottom >
                            口罩服從度
                        </Typography>
                        <Typography gutterBottom>
                            0%: 完全無人佩戴口罩<br/>100%:所有人皆佩戴口罩
                        </Typography>
                        <Slider
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={20}
                            marks={percentage_20_marks}
                            min={0}
                            max={100}
                            defaultValue={0}
                            onChangeCommitted={handleMask}
                        />
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div className={classes.narrowerOption}>
                        <Typography variant='h5' gutterBottom >
                            社交距離服從度
                        </Typography>
                        <Typography gutterBottom>
                            0%: 無法保持社交距離<br/>100%:所有人皆保持社交距離
                        </Typography>
                        <Slider
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={20}
                            marks={percentage_20_marks}
                            min={0}
                            max={100}
                            defaultValue={0}
                            onChangeCommitted={handleDistance}
                        />
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div className={classes.narrowerOption}>
                        <Typography variant='h5' gutterBottom >
                            洗手服從度
                        </Typography>
                        <Typography gutterBottom>
                            0%: 無人維持洗手習慣<br/>100%:所有人皆保持洗手習慣
                        </Typography>
                        <Slider
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={20}
                            marks={percentage_20_marks}
                            min={0}
                            max={100}
                            defaultValue={0}
                            onChangeCommitted={handleWash}
                        />
                    </div>
                </Grid>
            </Grid>
            <Vaccine 
                handleIsVaccineChange={handleIsVaccineChange}
                handleVaccineBrandChange={handleVaccineBrandChange}
                handleVaccineDoseChange={handleVaccineDoseChange}
                handleVaccineStrategyChange={handleVaccineStrategyChange}
            />
        </div>
    );
}