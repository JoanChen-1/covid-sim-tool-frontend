import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
Typography,
Grid,
Accordion,
AccordionSummary,
AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Sliders from './Sliders'; 
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) =>({
    title:{
        textAlign: 'center',
        fontWeight: 'bold',
        gutterBottom: true,
        fontSize: theme.typography.h3.fontSize
    },
    narrowerOption: {
        width: 200,
    },
    settingContainer: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
  }));

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
export default function DiseaseSetting (props){
    const { 
        handleRChange,
        handleRatiosChange,
        icu_admission,
        hospotalization,
        fatality
    } = props;
    const classes = useStyles();

    const handleR = (e, value) =>{
        handleRChange(value);
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
                        <div className={classes.narrowerOption}>
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
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography gutterBottom>
                            病毒基本再生數，指1個感染到某種傳染病的人，會把疾病傳染給其他多少個人的平均數。
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography variant='h5'>
                                各年齡層重症率<br/>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Sliders 
                                handleRatiosChange={handleRatiosChange}
                                category='icu'
                                defaultRatios={icu_admission}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={4}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography variant='h5'>
                                各年齡層住院率<br/>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Sliders 
                                handleRatiosChange={handleRatiosChange}
                                category='hospital'
                                defaultRatios={hospotalization}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={4}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography variant='h5'>
                                各年齡層死亡率<br/>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Sliders 
                                handleRatiosChange={handleRatiosChange}
                                category='fatality'
                                defaultRatios={fatality}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </>
    )
}