import React, { useState } from 'react';
import { 
  line,
  scaleLinear,
  scaleOrdinal,
  extent,
  // schemeCategory20,
  schemeBlues,
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
const title = '各縣市每日受感染人數'
const countyName = ['臺北縣', '宜蘭縣', '桃園縣', '新竹縣', '苗栗縣', 
'臺中縣', '彰化縣','南投縣', '雲林縣', '嘉義縣', '臺南縣', '高雄縣',
'屏東縣', '臺東縣', '花蓮縣', '澎湖縣', '基隆市', '新竹市', '臺中市',
'嘉義市', '臺南市', '臺北市', '高雄市', '連江縣', '金門縣'];
const county = [];
for(let i = 1; i <= 25; i++){
  const name = 'infected_county_' + toString(i);
  county.push(name);
}
const xValue = d => d.day;
const xAxisLabel = '天數';

const yValue = d => d.population;
const yAxisLabel = '受感染人數'; 

export default function CountyChart(props){
  const { data } = props;
  const [hoveredValue, setHoveredValue] = useState(null);
  
  if (!data) {
    return <pre></pre>;
  }

  //create nested data
  const nested = county.map((gp, idx)=>{
    const nestValueArr = data.map(d=>{
      const nestValue = {}
      nestValue['day'] = d.day;
      nestValue['population'] = d[gp];
      return nestValue;
    })
    const label = countyName[idx];
    return({'key': label, 'values':nestValueArr});
  })

  const xScale =
      scaleLinear()
      .domain(extent(data, xValue))
      .range([0, innerWidth])
      .nice();
  
  
  //concate all y value to find the max y
  const allData = nested.reduce(
    (accumulator, county) => accumulator.concat(county.values),
    []
  ); 

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
  const colorLegendLabel = '縣市別';

  const colorScale = scaleOrdinal(schemeBlues[25]);
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