import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Stepper, Step, StepLabel, Typography} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  wrapper: {
    position: "relative",
    backgroundColor: theme.palette.common.white,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  container: {
      marginRight: theme.spacing(20),
      marginLeft: theme.spacing(20),
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(5)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  steplabel:{
    fontSize: theme.typography.h6.fontSize
  },
  title:{
    textAlign: 'center',
    fontWeight: 'bold',
    gutterBottom: true,
    fontSize: theme.typography.h3.fontSize
  }
}));

export default function HorizontalLabelPositionBelowStepper() {
    const classes = useStyles();
    const steps = [
        '拉動滑桿調整疾病及政策設定', 
        '按下「開始模擬」', 
        '觀看模擬結果'
    ];

    return (
        <div className={classes.root}>
          <div className={classes.wrapper}>
            <div className={classes.container}>
              <Typography className={classes.title} gutterBottom>
                  使用指引
              </Typography>
              <Stepper alternativeLabel>
                  {steps.map((label) => (
                      <Step key={label}>
                          <StepLabel classes={{ label: classes.steplabel }}>
                              {label}
                          </StepLabel>
                      </Step>
                  ))}
              </Stepper>
            </div>
          </div>
        </div>
    );
}
