export const AxisBottom = ({ xScale, innerHeight, tickOffset = 3 }) =>//tickFormat,
  xScale.ticks().map(tickValue => (
    <g
      className="tick"
      key={tickValue}
      transform={`translate(${xScale(tickValue)},0)`}
    >
      <line y2={innerHeight} />
      <text style={{ textAnchor: 'middle' }} dy=".71em" y={innerHeight + tickOffset}>
        {/* {tickFormat(tickValue)} */}
        {tickValue}
      </text>
    </g>
  ));
