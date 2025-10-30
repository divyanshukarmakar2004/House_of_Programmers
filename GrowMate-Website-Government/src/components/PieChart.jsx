import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import {PieChartIcon} from "lucide-react";
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
import { Pie } from "react-chartjs-2";

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

const cropDistribution = [
  { name: "Rice", value: 45, color: "#DAA520" }, // Primary color
  { name: "Wheat", value: 25, color: "#2E7D32" }, // Secondary color
  { name: "Sugarcane", value: 15, color: "#004080" }, // Accent color
  { name: "Others", value: 15, color: "#66BB6A" }, // Highlight color
];


const pieChartData = {
  labels: cropDistribution.map((item) => item.name),
  datasets: [
    {
      data: cropDistribution.map((item) => item.value),
      backgroundColor: cropDistribution.map((item) => item.color),
      borderColor: "#FFFFFF", // Surface color
      borderWidth: 2,
    },
  ],
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000
  },
  plugins: {
    legend: {
      display: false,
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
};

export function PieChart() {
  return (
    <div className="space-y-6 ">
        {/* Pie Chart */}
      <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-500 bg-[#fff3d4]/45">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            <span>Crop Distribution</span>
          </CardTitle>
          <CardDescription>
            Distribution of crops across the state
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: "300px" }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {cropDistribution.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}