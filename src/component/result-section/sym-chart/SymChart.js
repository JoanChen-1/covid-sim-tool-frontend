import React, { useState } from 'react';
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
const height = 500;
const margin = { top: 100, right: 200, bottom: 65, left: 110 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 80;
const fadeOpacity = 0.2;
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;

export default function SymChart(props){
  const { data } = props;
  const [hoveredValue, setHoveredValue] = useState(null);

  if (!data) {
    return <pre></pre>;
  }

  const title = '每日有症狀及無症狀感染者人數'

  const symGp = [
    'sym_case_0',
    'sym_case_1',
    'sym_case_2',
    'sym_case_3',
    'sym_case_4',
    'sym_case_5',
    'sym_case_6',
    'sym_case_7',
    'sym_case_8',
    'sym_case_9',
  ]
  const asymGp = [
    'asym_case_0',
    'asym_case_1',
    'asym_case_2',
    'asym_case_3',
    'asym_case_4',
    'asym_case_5',
    'asym_case_6',
    'asym_case_7',
    'asym_case_8',
    'asym_case_9',
  ]

  //create nested data
  let nested = [];
  //sym
  const symArr = data.map( d =>{
    let symDailyTotal = 0;
    const nestValue = {}
    symGp.forEach((gp, idx)=>{
      symDailyTotal = symDailyTotal + d[gp];     
    })
    nestValue['day'] = d.day;
    nestValue['population'] = symDailyTotal;
    return nestValue;
  })
  nested.push({key: '有症狀人數', values: symArr});

  //asym
  const asymArr = data.map( d =>{
    let asymDailyTotal = 0;
    const nestValue = {}
    asymGp.forEach((gp)=>{
      // const asymTag = 'a'+ gp;
      asymDailyTotal = asymDailyTotal + d[gp];     
    })
    nestValue['day'] = d.day;
    nestValue['population'] = asymDailyTotal;
    return nestValue;
  })
  nested.push({key: '無症狀人數', values: asymArr});

  const totalArr = symArr.map((d, idx)=>{
    const nestValue = {};
    nestValue['day'] = d.day;
    nestValue['population'] = d.population + asymArr[idx].population; 
    return nestValue;
  })
  nested.push({key: '受感染總人數', values: totalArr});
  
console.log("nested: ", nested);
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
    .range(['#fb5858', '#145DA0', '#E1C340']);

  const filteredData = nested.filter(d => hoveredValue === colorValue(d));
  const circleRadius = 7;

  const lineGenerator = line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)))
    .curve(curveLinear);

  return (
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
  );
};