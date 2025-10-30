import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { BarChart3, TrendingUp} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const monthlyData = [
  { month: "Jan", farmers: 2400, crops: 1800 },
  { month: "Feb", farmers: 2210, crops: 1900 },
  { month: "Mar", farmers: 2290, crops: 2100 },
  { month: "Apr", farmers: 2000, crops: 1950 },
  { month: "May", farmers: 2181, crops: 2200 },
  { month: "Jun", farmers: 2500, crops: 2400 },
];

const cropDistribution = [
  { name: "Rice", value: 45, color: "#2E7D32" }, // Primary color
  { name: "Wheat", value: 25, color: "#66BB6A" }, // Secondary color
  { name: "Sugarcane", value: 15, color: "#004080" }, // Accent color
  { name: "Others", value: 15, color: "#DAA520" }, // Highlight color
];

const yieldTrend = [
  { month: "Jan", yield: 65 },
  { month: "Feb", yield: 68 },
  { month: "Mar", yield: 72 },
  { month: "Apr", yield: 70 },
  { month: "May", yield: 75 },
  { month: "Jun", yield: 78 },
];

const barChartData = {
  labels: monthlyData.map((item) => item.month),
  datasets: [
    {
      label: "Farmers",
      data: monthlyData.map((item) => item.farmers),
      backgroundColor: "#2E7D32", // Primary color
      borderColor: "#2E7D32",
      borderWidth: 1,
    },
    {
      label: "Crops",
      data: monthlyData.map((item) => item.crops),
      backgroundColor: "#66BB6A", // Secondary color
      borderColor: "#66BB6A",
      borderWidth: 1,
    },
  ],
};

const lineChartData = {
  labels: yieldTrend.map((item) => item.month),
  datasets: [
    {
      label: "Yield %",
      data: yieldTrend.map((item) => item.yield),
      borderColor: "#004080", // Accent color
      backgroundColor: "#004080",
      borderWidth: 3,
      fill: false,
      tension: 0.4,
      pointBackgroundColor: "#DAA520", // Highlight color for data points
      pointBorderColor: "#DAA520",
      pointHoverBackgroundColor: "#DAA520",
      pointHoverBorderColor: "#FFFFFF",
    },
  ],
};


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000, // Animation duration in milliseconds
    easing: 'easeOutQuart' // Animation easing function
  },
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#212121", // Text primary
        font: {
          weight: 'bold'
        },
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: "#FFFFFF", // Surface color
      titleColor: "#212121", // Text primary
      bodyColor: "#4E4E4E", // Text secondary
      borderColor: "#E0E0E0", // Border color
      borderWidth: 1,
      padding: 12,
      cornerRadius: 6,
      displayColors: true,
      boxPadding: 6
    },
  },
  scales: {
    x: {
      grid: {
        color: "#E0E0E0", // Border color
        drawBorder: true,
        drawOnChartArea: true,
        drawTicks: true,
      },
      ticks: {
        color: "#4E4E4E", // Text secondary
        padding: 8
      },
    },
    y: {
      grid: {
        color: "#E0E0E0", // Border color
        drawBorder: true,
        drawOnChartArea: true,
        drawTicks: true,
      },
      ticks: {
        color: "#4E4E4E", // Text secondary
        padding: 8
      },
    },
  },
};


export function DashboardCharts() {
  return (
    <div className="space-y-6 ">
      {/* Bar Chart */}
      <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-300 bg-[#fff3d4]/45">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Monthly Registration Trends</span>
          </CardTitle>
          <CardDescription>
            Farmer registrations and crop monitoring over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: "300px" }}>
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-400 bg-[#fff3d4]/45">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Yield Performance</span>
          </CardTitle>
          <CardDescription>
            Average crop yield percentage over months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: "250px" }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

