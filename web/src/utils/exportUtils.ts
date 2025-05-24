interface HistoricalData {
  timestamps: string[];
  temperature: number[];
  humidity: number[];
  pressure: number[];
  co2: number[];
  gas: number[];
}

export const exportToCSV = (historicalData: HistoricalData): void => {
  const headers = ['Timestamp', 'Temperature', 'Humidity', 'Pressure', 'CO2', 'Gas'];
  const data = historicalData.timestamps.map((timestamp, index) => [
    timestamp,
    historicalData.temperature[index],
    historicalData.humidity[index],
    historicalData.pressure[index],
    historicalData.co2[index],
    historicalData.gas[index],
  ]);

  const csvContent = [headers.join(','), ...data.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `sensor_data_${new Date().toISOString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
