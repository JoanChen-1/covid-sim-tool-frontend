import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import { 
Typography,
Grid,
} from '@material-ui/core';
const useStyles = makeStyles((theme) =>({
    narrowerOption: {
        width: 300,
    }
}));
const age_gp = ['0-19歲','20-44歲','45-54歲','55-64歲','65-74歲', '75-84歲', '85歲+'];
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
export default function Sliders (props){
    const { 
        handleRatiosChange,
        category,
        defaultRatios
    } = props;
    const classes = useStyles();

    const handleRatios = (key, idx) => (e, value) =>{
        handleRatiosChange(key, idx, value);
    };
    return(
        <div className={classes.narrowerOption}>
            {defaultRatios.map((ratio, idx) =>(
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
                            onChangeCommitted={handleRatios(category, idx)}
                        />                                       
                    </Grid>
                </Grid>
            ))}
        </div>
    )
}