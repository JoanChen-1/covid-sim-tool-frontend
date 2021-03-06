import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import AgeChart from './age-chart/AgeChart';
import AgePercentChart from './age-percent-chart/AgePercentChart';
import SymChart from './sym-chart/SymChart';
import DiseaseStatusChart from './disease-status-chart/DiseaseStatusChart';
import CountyChart from './county-chart/CountyChart'

const useStyles = makeStyles((theme) =>({
    wrapper: {
        position: "relative",
        backgroundColor: theme.palette.common.white,
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(2),
    },
    container: {
        marginRight: theme.spacing(5),
        marginLeft: theme.spacing(5),
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5)
    },
    root: {
        minWidth: 1200,
        minHeight: 700,
        border: 10,
        borderRadius: "5em",
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        gutterBottom: true,
        fontSize: theme.typography.h3.fontSize
    }
}));

export default function ResultSection(props) {
    const { data, diseaseRatios } = props;
    const classes = useStyles();
    return(
        <Fragment>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <Typography className={classes.title} gutterBottom>
                        模擬結果
                    </Typography>
                    <AgeChart data={data}/>
                    <AgePercentChart data={data}/>
                    <SymChart data={data}/>
                    <DiseaseStatusChart data={data} diseaseRatios={diseaseRatios}/>
                    <CountyChart data={data}/>
                </div>
            </div>
        </Fragment>
    );
}