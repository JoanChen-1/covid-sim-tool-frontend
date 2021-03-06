import React, { useMemo } from 'react';
import moment from 'moment';
import { format } from 'd3';
import './ChartToolTip.css';

const numberFormat = format(',');

// Pcrovine/State: ""
// Country/Region: "Peru"
// Lat: -9.19
// Long: -75.0152
// date: Fri Mar 20 2020 00:00:00 GMT+1030 (Australian Central Daylight Time) {}
// Confirmed: 234
// Deaths: 3

export const ChartToolTip = ({ data, x, y, color, up }) => {
  const text = useMemo(() => {
    if (!data) return;
    return {
      day: moment(data['day']).format('Do MMM'),
      country: data['Country/Region'],
      confirmed: numberFormat(data['Confirmed']),
      deaths: numberFormat(data['Deaths']),
      recovered: numberFormat(data['Recovered'])
    };
  }, [data]);

  return (
    <div
      className="wrapper"
      style={{
        transform: `translate(${x}px,${up ? `calc(${y-10}px - 100%)` : `${y+30}px`})`,
        backgroundColor: color,
        opacity: text ? 0.85 : 0,
      }}
    >
      <div className="chart-tooltip">
        { data && (
          <>
            <b>{text.day}</b><br/>
            <span>Deaths: {text.fatality}</span><br/>
            <span>Hospital: {text.hospital}</span><br/>
            <span>ICU: {text.icu}</span>
          </>
        )}
      </div>
    </div>
  );
};