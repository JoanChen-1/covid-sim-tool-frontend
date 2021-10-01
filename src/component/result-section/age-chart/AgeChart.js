import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Button, Grid, Radio, RadioGroup, FormControlLabel, FormControl } from '@material-ui/core';

import GetAppIcon from '@material-ui/icons/GetApp';
import { 
  line,
  scaleLinear,
  scaleOrdinal,
  extent,
  schemeCategory10,
  descending,
  curveLinear,
  maxIndex,
} from 'd3';
import { AxisBottom } from '../AxisBottom';
import { AxisLeft } from '../AxisLeft';
import { ColorLegend } from '../ColorLegend';

const width = 1200;
const height = 450;
const margin = { top: 100, right: 200, bottom: 65, left: 90 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 60;
const fadeOpacity = 0.2;
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;
const ageGpName10 = ['0 - 9 歲', '10 - 19 歲', '20 - 29 歲', '30 - 39 歲',
'40 - 49 歲', '50 - 59 歲', '60 - 69 歲', '70 - 79 歲','80 - 89 歲', '90 - 99 歲'];
const ageGpName5 = ['0 - 19 歲', '20 - 39 歲','40 - 59 歲', '60 - 79 歲','80 - 99 歲'];
const ageGpName3 = ['0 - 19 歲', '20 - 79 歲','80 - 99 歲'];

export default function AgeChart(props){
  const { data } = props;
  const ref = useRef(null);
  const [ageGpMethod, setAgeGpMethod] = useState("10");
  const [hoveredValue, setHoveredValue] = useState(null);

  const handleAgeGpMethod = (e, value) => {
    setAgeGpMethod(value);
  };

  if (!data) {
    return <pre>調整完下方條件後，按下「開始模擬」，即可看到模擬結果喔！</pre>;
  }
  else if(data.length <= 0){
    return <pre>此設定尚未有資料</pre>
  }
    const title = '各年齡層每日新增受感染人數'

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

    let nested=[];
    //create nested data: 10 age groups
    if (ageGpMethod === '10'){
        nested = infectGp.map((gp, idx)=>{
        const nestValueArr = data.map(d=>{
            const nestValue = {}
            nestValue['day'] = d.day;
            nestValue['population'] = Math.floor(d[gp]);
            return nestValue;
        })
        const label = ageGpName10[idx];
        return({'key': label, 'values':nestValueArr});
        })
    }

    //create nested data: 5 age groups
    if (ageGpMethod === '5'){
        infectGp.forEach((gp, idx)=>{
            if (idx % 2 === 0){
                const nestValueArr = data.map(d=>{
                    const nestValue = {}
                    nestValue['day'] = d.day;
                    nestValue['population'] = Math.floor(d[infectGp[idx]]) + Math.floor(d[infectGp[idx+1]]);
                    return nestValue;
                })
                const label = ageGpName5[idx/2];
                nested.push({'key': label, 'values':nestValueArr});
            }
        })
    }

    //create nested data: 3 age groups
    if (ageGpMethod === '3'){
        let nestValueArr = data.map(d=>{
            const nestValue = {}
            nestValue['day'] = d.day;
            nestValue['population'] = Math.floor(d['infected_case_0']) + Math.floor(d['infected_case_1']);
            return nestValue;
        })
        nested.push({'key': ageGpName3[0], 'values':nestValueArr});

        nestValueArr = data.map(d=>{
            const nestValue = {}
            nestValue['day'] = d.day;
            nestValue['population'] = Math.floor(d['infected_case_2']) + Math.floor(d['infected_case_3']) + Math.floor(d['infected_case_4'])
             + Math.floor(d['infected_case_5']) + Math.floor(d['infected_case_6']) + Math.floor(d['infected_case_7']);
            return nestValue;
        })
        nested.push({'key': ageGpName3[1], 'values':nestValueArr});

        nestValueArr = data.map(d=>{
            const nestValue = {}
            nestValue['day'] = d.day;
            nestValue['population'] = Math.floor(d['infected_case_8']) + Math.floor(d['infected_case_9']);
            return nestValue;
        })
        nested.push({'key': ageGpName3[2], 'values':nestValueArr});

    }

    console.log("AgeChart: ", nested);
  
  const xValue = d => d.day;
  const xAxisLabel = '天數';
  
  const xScale =
      scaleLinear()
      .domain(extent(data, xValue))
      .range([0, innerWidth])
      .nice();
  
  
  //concate all y value to find the max y
  const allData = nested.reduce(
    (accumulator, ageGp) => accumulator.concat(ageGp.values),
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

  const lastYValue = d =>
    yValue(d.values[maxYIndex]);

  nested.sort((a, b) =>
  descending(lastYValue(a), lastYValue(b))
  )

  //10 colors
  const colorValue = d => d.key;
  const colorLegendLabel = '年齡層';

  const colorScale = scaleOrdinal(schemeCategory10);
  colorScale.domain(nested.map(d => d.key));

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
            <AxisLeft 
              yScale={yScale}
              innerWidth={innerWidth}
              tickOffset={7}
              />
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
                  className="stroke-line"
                  key={gp.key}
                  fill="none"
                  stroke={colorScale(gp.key)}
                  d={lineGenerator(gp.values)} />
              );
            })}
            </g>
            {filteredData.map(gp => {
              return (
                <path 
                  className="stroke-line"
                  key={gp.key}
                  fill="none"
                  stroke={colorScale(gp.key)}
                  d={lineGenerator(gp.values)} />
              );
            })}
          </g>
        </svg>
      </div> 
      <Grid 
        container   
        justify="center"
      >       
        <Grid item xs={11} align='center'>
          <FormControl component="fieldset">
          <RadioGroup row aria-label="age-gp-method" name="age-gp-method" value={ageGpMethod} onChange={handleAgeGpMethod}>
              <FormControlLabel value="3" control={<Radio />} label="三個年齡層：幼年、壯年、老年" />
              <FormControlLabel value="5" control={<Radio />} label="五個年齡層：每二十歲一組" />
              <FormControlLabel value="10" control={<Radio />} label="十個年齡層：每十歲一組" />
          </RadioGroup>
          </FormControl> 
        </Grid>
        <Grid item xs={1} align="center">
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
      </Grid>   
    </>
  );
};