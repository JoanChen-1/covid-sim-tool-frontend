import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Button, Grid } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { 
  line,
  scaleLinear,
  scaleOrdinal,
  extent,
  maxIndex,
  descending,
  curveLinear
} from 'd3';
import { AxisBottom } from '../AxisBottom';
import { AxisLeft } from '../AxisLeft';
import { ColorLegend } from '../ColorLegend';

const width = 1200;
const height = 450;
const margin = { top: 100, right: 200, bottom: 65, left: 110 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 80;
const fadeOpacity = 0.2;
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;

export default function DiseaseStatusChart(props){
  const ref = useRef(null);
  const { data, diseaseRatios } = props;
  const [hoveredValue, setHoveredValue] = useState(null);

  if (!data) {
    return <pre></pre>;
  }

  const title = '每日新增重症、住院、死亡人數'

  const infectGp = [
    'infected_case_0',
    'infected_case_1',
    'infected_case_2',
    'infected_case_3',
    'infected_case_4',
    'infected_case_5',
    'infected_case_6',
    'infected_case_7',
    'infected_case_8',
    'infected_case_9',
  ]

  let icu, hospital, fatality;
  diseaseRatios.forEach(ratio=>{
    if(ratio.key === "icu"){
      icu = ratio.values;
    }
  })
  diseaseRatios.forEach(ratio=>{
    if(ratio.key==='hospital'){
      hospital = ratio.values;
    }
  })
  diseaseRatios.forEach(ratio=>{
    if(ratio.key==='fatality'){
      fatality = ratio.values;
    }
  })
  icu = [icu[0], icu[0], icu[1], icu[1], (icu[1]+icu[2])/2, (icu[2]+icu[3])/2, (icu[3]+icu[4])/2, (icu[4]+icu[5])/2, (icu[5]+icu[6])/2, icu[6]];
  hospital = [hospital[0], hospital[0], hospital[1], hospital[1], (hospital[1]+hospital[2])/2, (hospital[2]+hospital[3])/2, (hospital[3]+hospital[4])/2, (hospital[4]+hospital[5])/2, (hospital[5]+hospital[6])/2, hospital[6]];
  fatality = [fatality[0], fatality[0], fatality[1], fatality[1], (fatality[1]+fatality[2])/2, (fatality[2]+fatality[3])/2, (fatality[3]+fatality[4])/2, (fatality[4]+fatality[5])/2, (fatality[5]+fatality[6])/2, fatality[6]];

  //create nested data
  let nested = [];
  //icu
  const icuArr = data.map( d =>{
    let icuDailyTotal = 0;
    const nestValue = {}
    infectGp.forEach((gp, idx)=>{
      icuDailyTotal = icuDailyTotal + d[gp]*icu[idx];     
    })
    nestValue['day'] = d.day;
    nestValue['population'] = Math.round(icuDailyTotal/100);
    return nestValue;
  })
  nested.push({key: '重症人數', values: icuArr});

  //hospital
  const hospitalArr = data.map( d =>{
    let hospitalDailyTotal = 0;
    const nestValue = {}
    infectGp.forEach((gp, idx)=>{
      hospitalDailyTotal = hospitalDailyTotal + d[gp]*hospital[idx];     
    })
    nestValue['day'] = d.day;
    nestValue['population'] = Math.round(hospitalDailyTotal/100);
    return nestValue;
  })
  nested.push({key: '住院人數', values: hospitalArr});

  //fatality
  const fatalityArr = data.map( d =>{
    let fatalityDailyTotal = 0;
    const nestValue = {}
    infectGp.forEach((gp, idx)=>{
      fatalityDailyTotal = fatalityDailyTotal + d[gp]*fatality[idx];     
    })
    nestValue['day'] = d.day;
    nestValue['population'] = Math.round(fatalityDailyTotal/100);
    return nestValue;
  })
  nested.push({key: '死亡人數', values: fatalityArr});

  const xValue = d => d.day;
  const xAxisLabel = '天數';
  
  const xScale = scaleLinear()
  .domain(extent(data, xValue))
  .range([0, innerWidth])
  .nice();
  
  
  //concate all y value to find the max y
  const allData = nested.reduce(
    (accumulator, key) => accumulator.concat(key.values),
    []
  );

  const yValue = d => d.population;
  const yAxisLabel = '人數';  

  const yScale = scaleLinear()
    .domain(extent(allData, yValue))
    .range([innerHeight, 0])
    .nice();

  //coordinate nested by the y value with legend
  const maxYIndex = maxIndex(allData, yValue) % data.length;

  const maxYValue = d =>
    yValue(d.values[maxYIndex - 1]);

  nested.sort((a, b) =>
  descending(maxYValue(a), maxYValue(b))
  )

  //10 colors
  const colorValue = d => d.key;
  const colorLegendLabel = '狀態';

  // const colorScale = scaleOrdinal(schemeCategory10);
  // colorScale.domain(nested.map(d => d.key));
  const colorScale = scaleOrdinal()
    .domain(nested.map(colorValue))
    .range(['#E6842A', '#137B80', '#8E6C8A']);

  const filteredData = nested.filter(d => hoveredValue === colorValue(d));
  const circleRadius = 7;

  const lineGenerator = line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)))
    .curve(curveLinear);

  const onButtonClick = () => {
    if (ref.current === null) {
      return
    }
    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'covid-sim-age.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <>
      <div ref={ref}>
        <svg width={width} height={height}>
            <text
              className="axis-title-label"
              x={width / 2}
              y={50}
              textAnchor="middle"
            >
              {title}
            </text>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <AxisBottom
              xScale={xScale}
              innerHeight={innerHeight}
              tickOffset={7}
            />
            <text
              className="axis-label"
              textAnchor="middle"
              transform={`translate(${-yAxisLabelOffset},${innerHeight /
                2}) rotate(-90)`}
            >
              {yAxisLabel}
            </text>
            <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={7} />
            <text
              className="axis-label"
              x={innerWidth / 2}
              y={innerHeight + xAxisLabelOffset}
              textAnchor="middle"
            >
              {xAxisLabel}
            </text>
            <g transform={`translate(${innerWidth + 60}, 60)`}>
              <text x={35} y={-25} className="axis-label" textAnchor="middle">
                {colorLegendLabel}
              </text>
              <ColorLegend
                  tickSpacing={22}
                  tickTextOffset={12}
                  tickSize={circleRadius}
                  colorScale={colorScale}
                  onHover={setHoveredValue}
                  hoveredValue={hoveredValue}
                  fadeOpacity={fadeOpacity}
                  />
            </g>
            <g opacity={hoveredValue ? fadeOpacity : 1}>
            {nested.map(gp => {
              return (
                <path 
                  key={gp.key}
                  className="stroke-line"
                  fill="none"
                  stroke={colorScale(gp.key)}
                  d={lineGenerator(gp.values)} />
              );
            })}
            </g>
            {filteredData.map(gp => {
              return (
                <path 
                  key={gp.key}
                  className="stroke-line"
                  fill="none"
                  stroke={colorScale(gp.key)}
                  d={lineGenerator(gp.values)} />
              );
            })}
          </g>
        </svg>
      </div> 
      <Grid container justify="flex-end">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onButtonClick}
          // className={classes.button}
          startIcon={<GetAppIcon />}
        >
          下載圖表
        </Button>
      </Grid>    
    </>
  );
};