import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Button, Grid } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { 
  line,
  scaleLinear,
  scaleOrdinal,
  extent,
  schemePaired,
  descending,
  curveLinear,
  maxIndex,
} from 'd3';
import { AxisBottom } from '../AxisBottom';
import { AxisLeft } from '../AxisLeft';
import { ColorLegend2 } from '../ColorLegend2';
// import { useD3Zoom } from '../useD3Zoom';

const width = 1200;
const height = 450;
const margin = { top: 100, right: 200, bottom: 65, left: 90 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 60;
const fadeOpacity = 0.2;
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;
const title = '各縣市每日新增受感染人數'
const countyName = ['臺北縣', '宜蘭縣', '桃園縣', '新竹縣', '苗栗縣', 
'臺中縣', '彰化縣','南投縣', '雲林縣', '嘉義縣', '臺南縣', '高雄縣',
'屏東縣', '臺東縣', '花蓮縣', '澎湖縣', '基隆市', '新竹市', '臺中市',
'嘉義市', '臺南市', '臺北市', '高雄市', '連江縣', '金門縣'];
const county = [];
for(let i = 1; i <= 25; i++){
  const name = 'infected_county_' + i.toString();
  county.push(name);
}
const xValue = d => d.day;
const xAxisLabel = '天數';

const yAxisLabel = '受感染人數';

export default function CountyChart(props){
  const ref = useRef(null);
  const { data } = props;
  // const svgInteractionRef = useRef();
  // const zoomProps = useD3Zoom({ ref: svgInteractionRef });
  const [selectedValue, setSelectedValue] = useState(['臺北市', '臺中市', '高雄市']);
  
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

  const yValue = d => d.population;
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
  const colorLegendLabel = '縣市別';

  const colorScale = scaleOrdinal(schemePaired);
  colorScale.domain(nested.map(d => d.key));

  const filteredData = nested.filter(d => selectedValue.includes(d.key));

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
  // const xScaleShow = () => {
  //   if (!xScale) return;
  //   return zoomProps.rescaleX ? zoomProps.rescaleX(xScale) : xScale.copy();
  // };

  // const yScaleShow = () => {
  //   if (!yScale) return;
  //   return zoomProps.rescaleY ? zoomProps.rescaleY(yScale) : yScale.copy();
  // };

  // const xShow = xScaleShow(xScale.invert(x));
  // const yShow = yScaleShow(yScale.invert(y));

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
              <ColorLegend2
                tickSpacing={22}
                tickTextOffset={12}
                tickSize={circleRadius}
                colorScale={colorScale}
                onClickEvent={setSelectedValue}
                selectedValue={selectedValue}
                fadeOpacity={fadeOpacity}
              />
            </g>
            {/* <svg ref={svgInteractionRef}>
              <g transform={`translate(${zoomProps.x}, ${zoomProps.y}) scale(${zoomProps.k})`}> */}
                {filteredData && filteredData.map(gp => {
                  return (
                    <path 
                      className='stroke-line'
                      key={gp.key}
                      fill="none"
                      stroke={colorScale(gp.key)}
                      d={lineGenerator(gp.values)} />
                  );
                })}
              {/* </g>
            </svg> */}
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