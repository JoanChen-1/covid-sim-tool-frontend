import React, { useState } from 'react';
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
const height = 500;
const margin = { top: 100, right: 200, bottom: 65, left: 90 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 60;
const fadeOpacity = 0.2;
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;
const ageGpName = ['0 - 9 歲', '10 - 19 歲', '20 - 29 歲', '30 - 39 歲',
'40 - 49 歲', '50 - 59 歲', '60 - 69 歲', '70 - 79 歲','80 - 89 歲', '90 - 99 歲'];
export default function AgeChart(props){
  const { data } = props;
  const [hoveredValue, setHoveredValue] = useState(null);
  
  if (!data) {
    return <pre>調整完上方條件後，按下「開始模擬」，即可看到模擬結果喔！</pre>;
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

  //create nested data
  const nested = infectGp.map((gp, idx)=>{
    const nestValueArr = data.map(d=>{
      const nestValue = {}
      nestValue['day'] = d.day;
      nestValue['population'] = d[gp];
      return nestValue;
    })
    const label = ageGpName[idx];
    return({'key': label, 'values':nestValueArr});
  })

  
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
  const yAxisLabel = '受感染人數';  

  const yScale = scaleLinear()
      .domain(extent(allData, yValue))
      .range([innerHeight, 0])
      .nice();

  //coordinate nested by the y value with legend
  const maxYIndex = maxIndex(allData, yValue) % data.length;

  const lastYValue = d =>
    yValue(d.values[maxYIndex - 1]);

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
  );
};