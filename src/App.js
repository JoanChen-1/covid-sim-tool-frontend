import React, { useState } from 'react';

import './App.css';
import { CssBaseline, Divider } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import NavBar from './component/app-bar/app-bar';
import ResultSection from './component/result-section/result-section';
import HeadSection from './component/head-section/head-section';
import SearchSection from './component/search-section/search-section';
import Footer from './component/footer/footer';
import { getData } from './util';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'center',
  },
  content: {
    flexGrow: 1,
    height: '89vh',
    overflow: 'auto',
  }
}));

export default function App() {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [diseaseRatios, setDiseaseRatios] = useState(null);
  const onClick = (r, mask, distance, wash, isVaccine, vaccineBrand, vaccineDose, vaccineStrategy, ratios) =>{
    console.log(r, mask, distance, wash, isVaccine, vaccineBrand, vaccineDose, vaccineStrategy);
    getData(r, mask, distance, wash, isVaccine, vaccineBrand, vaccineDose, vaccineStrategy)
    .then(response=>{
      console.log("data: ", response['data']);
      if(response === 'failed'){
        console.log("failed");
        setData([]);
      }
      else{
        setDiseaseRatios(ratios);
        setData(response['data']);
      }
    })
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar />
      <main className={classes.content}>
        <HeadSection />
        <Divider variant='middle'/>
        <SearchSection onClick={onClick}/>
        <Divider variant='middle'/>
        <ResultSection data={data} diseaseRatios={diseaseRatios}/>
        <Footer />
      </main>
    </div>
  );
}


