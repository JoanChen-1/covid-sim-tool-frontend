export const ColorLegend2 = ({
    colorScale,
    tickSpacing = 20,
    tickSize = 10,
    tickTextOffset = 20,
    onClickEvent,
    selectedValue,
    fadeOpacity
  }) =>
    colorScale.domain().map((domainValue, i) => (
      <g
        key={i}
        className="tick-option"
        transform={`translate(0,${i * tickSpacing})`}
        onClick={() => {
            if(selectedValue.includes(domainValue)){
                const newSelected = selectedValue.filter(x=>{return x !== domainValue})
                onClickEvent(newSelected);
            }
            else{
                onClickEvent([...selectedValue, domainValue]);
            }
        }}
        opacity={selectedValue.includes(domainValue) ? 1 : fadeOpacity}
      >
        <circle fill={colorScale(domainValue)} r={tickSize} />
        <text x={tickTextOffset} dy=".32em">
          {domainValue}
        </text>
      </g>
    ));