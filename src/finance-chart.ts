export function branchRevenueChart(branches: { branchId: string | null; branchName: string; revenue: number | string }[]) {
  const positive = branches.filter(item => Number(item.revenue) > 0);
  const total = positive.reduce((sum, item) => sum + Number(item.revenue), 0);
  let angle = 0;
  const pie = positive.map((item, index) => {
    const from = angle;
    angle += Number(item.revenue) / total * 360;
    return `hsl(${(145 + index * 37) % 360} 58% 45%) ${from}deg ${angle}deg`;
  }).join(',');
  return pie;
}
