interface AirQualityStatus {
  status: string;
  color: string;
}

interface Stats {
  current: number;
  average: string | number;
  min: string | number;
  max: string | number;
  trend: number;
}

export const getAirQualityStatus = (co2Level: number): AirQualityStatus => {
  if (co2Level < 800) return { status: 'Excellent', color: '#00C853' };
  if (co2Level < 1000) return { status: 'Good', color: '#64DD17' };
  if (co2Level < 1500) return { status: 'Fair', color: '#FFD600' };
  if (co2Level < 2000) return { status: 'Poor', color: '#FF9100' };
  return { status: 'Dangerous', color: '#FF3D00' };
};

export const getStats = (data: number[]): Stats => ({
  current: data[data.length - 1] || 0,
  average: data.length ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1) : 0,
  min: data.length ? Math.min(...data).toFixed(1) : 0,
  max: data.length ? Math.max(...data).toFixed(1) : 0,
  trend: data.length > 1 ? data[data.length - 1] - data[data.length - 2] : 0,
});
