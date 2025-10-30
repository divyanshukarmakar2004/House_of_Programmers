import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Sidebar } from "../components/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Gift, Users, DollarSign,IndianRupee, TrendingUp, Menu, Download, Eye, Plus } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const schemes = [
  {
    id: 1,
    name: "PM-KISAN",
    description: "Direct income support to farmers",
    totalBudget: 50000000,
    utilized: 38500000,
    beneficiaries: 15420,
    targetBeneficiaries: 18000,
    status: "Active",
    launchDate: "2019-02-24",
    category: "Income Support",
    eligibility: "Small and marginal farmers with cultivable land",
    benefits: "₹6,000 per year in three installments",
  },
  {
    id: 2,
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme for farmers",
    totalBudget: 25000000,
    utilized: 18750000,
    beneficiaries: 8750,
    targetBeneficiaries: 12000,
    status: "Active",
    launchDate: "2016-01-13",
    category: "Insurance",
    eligibility: "All farmers growing notified crops",
    benefits: "Comprehensive risk cover for crops",
  },
  {
    id: 3,
    name: "Soil Health Card Scheme",
    description: "Soil testing and health monitoring",
    totalBudget: 8000000,
    utilized: 7200000,
    beneficiaries: 12300,
    targetBeneficiaries: 15000,
    status: "Active",
    launchDate: "2015-02-19",
    category: "Soil Health",
    eligibility: "All farmers with agricultural land",
    benefits: "Free soil testing and nutrient recommendations",
  },
  {
    id: 4,
    name: "Kisan Credit Card",
    description: "Credit support for agricultural activities",
    totalBudget: 75000000,
    utilized: 52500000,
    beneficiaries: 6850,
    targetBeneficiaries: 10000,
    status: "Active",
    launchDate: "1998-08-01",
    category: "Credit",
    eligibility: "Farmers with valid land records",
    benefits: "Easy access to credit for farming needs",
  },
  {
    id: 5,
    name: "Organic Farming Promotion",
    description: "Support for organic farming practices",
    totalBudget: 12000000,
    utilized: 4800000,
    beneficiaries: 2100,
    targetBeneficiaries: 5000,
    status: "New",
    launchDate: "2024-01-01",
    category: "Sustainable Agriculture",
    eligibility: "Farmers willing to adopt organic practices",
    benefits: "Subsidies on organic inputs and certification",
  },
];

const categoryData = [
  { name: "Income Support", value: 35, color: "#2E7D32" }, // Primary color
  { name: "Insurance", value: 25, color: "#66BB6A" }, // Secondary color
  { name: "Credit", value: 20, color: "#004080" }, // Accent color
  { name: "Soil Health", value: 12, color: "#DAA520" }, // Highlight color
  { name: "Sustainable Agriculture", value: 8, color: "#4E4E4E" }, // Text secondary color
];

const monthlyEnrollment = [
  { month: "Jul", enrolled: 1200, target: 1500 },
  { month: "Aug", enrolled: 1450, target: 1500 },
  { month: "Sep", enrolled: 1680, target: 1800 },
  { month: "Oct", enrolled: 1920, target: 2000 },
  { month: "Nov", enrolled: 2150, target: 2200 },
  { month: "Dec", enrolled: 2380, target: 2500 },
];

const districtPerformance = [
  { district: "Cuttack", beneficiaries: 3420, utilization: 85 },
  { district: "Bhubaneswar", beneficiaries: 2890, utilization: 78 },
  { district: "Puri", beneficiaries: 2156, utilization: 92 },
  { district: "Khordha", beneficiaries: 1987, utilization: 88 },
  { district: "Ganjam", beneficiaries: 1654, utilization: 76 },
];

export default function SchemesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "New":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const calculateUtilizationPercentage = (utilized, total) => {
    return Math.round((utilized / total) * 100);
  };

  const calculateBeneficiaryPercentage = (current, target) => {
    return Math.round((current / target) * 100);
  };

  // Chart configurations
  const categoryConfig = {
    labels: categoryData.map(item => item.name),
    datasets: [
      {
        data: categoryData.map(item => item.value),
        backgroundColor: categoryData.map(item => item.color),
        borderWidth: 0,
      },
    ],
  };

  const enrollmentConfig = {
    labels: monthlyEnrollment.map(item => item.month),
    datasets: [
      {
        label: "Enrolled",
        data: monthlyEnrollment.map(item => item.enrolled),
        backgroundColor: "#2E7D32", // Primary color
      },
      {
        label: "Target",
        data: monthlyEnrollment.map(item => item.target),
        backgroundColor: "#66BB6A", // Secondary color
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#212121", // Text primary
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: "#FFFFFF", // Surface color
        titleColor: "#212121", // Text primary
        bodyColor: "#212121", // Text primary
        borderColor: "#E0E0E0", // Border color
        borderWidth: 1,
        padding: 10,
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#E0E0E0", // Border color
        },
        ticks: {
          color: "#4E4E4E", // Text secondary
        },
      },
      x: {
        grid: {
          color: "#E0E0E0", // Border color
        },
        ticks: {
          color: "#4E4E4E", // Text secondary
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Schemes & Subsidies</h1>
              <p className="text-sm text-muted-foreground">Government schemes and subsidy management</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Scheme
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Total Schemes",
                value: "5",
                change: "+1 new this year",
                icon: Gift,
                color: "text-blue-500",
              },
              {
                title: "Total Beneficiaries",
                value: "45,420",
                change: "+2,340 this month",
                icon: Users,
                color: "text-green-500",
              },
              {
                title: "Budget Utilized",
                value: "₹121.75 Cr",
                change: "77% of total budget",
                icon: IndianRupee,
                color: "text-purple-500",
              },
              {
                title: "Avg. Enrollment Rate",
                value: "85.2%",
                change: "+5.3% improvement",
                icon: TrendingUp,
                color: "text-orange-500",
              },
            ].map((metric, index) => (
              <Card
                key={metric.title}
                className="animate-in fade-in-0 slide-in-from-bottom-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.change}</p>
                    </div>
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
            <CardHeader>
              <CardTitle>Filter Schemes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Categories">All Categories</SelectItem>
                    <SelectItem value="Income Support">Income Support</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                    <SelectItem value="Soil Health">Soil Health</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Status">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">Reset Filters</Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="schemes" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schemes">Active Schemes</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="schemes" className="space-y-4">
              {schemes.map((scheme, index) => (
                <Card
                  key={scheme.id}
                  className="animate-in fade-in-0 slide-in-from-left-2 hover:shadow-md transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-2 lg:space-y-0">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-foreground">{scheme.name}</h3>
                            <Badge variant="outline" className={getStatusColor(scheme.status)}>
                              {scheme.status}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {scheme.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{scheme.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Budget Utilization</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>₹{(scheme.utilized / 10000000).toFixed(1)}Cr</span>
                              <span>{calculateUtilizationPercentage(scheme.utilized, scheme.totalBudget)}%</span>
                            </div>
                            <Progress
                              value={calculateUtilizationPercentage(scheme.utilized, scheme.totalBudget)}
                              className="h-2"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Beneficiaries</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{scheme.beneficiaries.toLocaleString()}</span>
                              <span>
                                {calculateBeneficiaryPercentage(scheme.beneficiaries, scheme.targetBeneficiaries)}%
                              </span>
                            </div>
                            <Progress
                              value={calculateBeneficiaryPercentage(scheme.beneficiaries, scheme.targetBeneficiaries)}
                              className="h-2"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Launch Date</p>
                          <p className="text-sm">{new Date(scheme.launchDate).toLocaleDateString()}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Total Budget</p>
                          <p className="text-sm font-medium">₹{(scheme.totalBudget / 10000000).toFixed(1)} Crores</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Eligibility</p>
                          <p className="text-sm">{scheme.eligibility}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Benefits</p>
                          <p className="text-sm">{scheme.benefits}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scheme Distribution by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ height: "300px" }}>
                      <Doughnut data={categoryConfig} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {categoryData.map((item) => (
                        <div key={item.name} className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-muted-foreground">
                            {item.name} ({item.value}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Enrollment Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ height: "300px" }}>
                      <Bar data={enrollmentConfig} options={chartOptions} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>District-wise Performance</CardTitle>
                  <CardDescription>Beneficiaries and utilization rates by district</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {districtPerformance.map((district, index) => (
                      <div
                        key={district.district}
                        className="flex items-center justify-between p-4 rounded-lg border border-border animate-in fade-in-0 slide-in-from-left-2"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="space-y-1">
                          <h4 className="font-medium text-foreground">{district.district}</h4>
                          <p className="text-sm text-muted-foreground">
                            {district.beneficiaries.toLocaleString()} beneficiaries
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-medium">{district.utilization}% utilization</p>
                          <div className="w-24">
                            <Progress value={district.utilization} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

