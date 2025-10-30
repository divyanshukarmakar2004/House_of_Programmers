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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Calendar } from "../components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/Popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog";
import { Sidebar } from "../components/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  FileText,
  Download,
  CalendarIcon,
  TrendingUp,
  Users,
  BarChart3,
  Menu,
  Plus,
  Eye,
  Filter,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const reports = [
  {
    id: 1,
    title: "Monthly Farmer Registration Report",
    description:
      "Comprehensive analysis of new farmer registrations across all districts",
    type: "Registration",
    generatedDate: "2024-12-20",
    generatedBy: "System Admin",
    status: "Completed",
    fileSize: "2.4 MB",
    downloadCount: 45,
    format: "PDF",
  },
  {
    id: 2,
    title: "Crop Yield Performance Analysis",
    description:
      "Detailed yield analysis comparing current season with historical data",
    type: "Analytics",
    generatedDate: "2024-12-19",
    generatedBy: "Data Analyst",
    status: "Completed",
    fileSize: "5.1 MB",
    downloadCount: 78,
    format: "Excel",
  },
  {
    id: 3,
    title: "Pest Outbreak Summary Report",
    description: "Summary of pest outbreaks and control measures implemented",
    type: "Pest Control",
    generatedDate: "2024-12-18",
    generatedBy: "Field Officer",
    status: "Completed",
    fileSize: "1.8 MB",
    downloadCount: 32,
    format: "PDF",
  },
  {
    id: 4,
    title: "Market Price Trends Analysis",
    description: "Analysis of crop price fluctuations and market trends",
    type: "Market",
    generatedDate: "2024-12-17",
    generatedBy: "Market Analyst",
    status: "Processing",
    fileSize: "3.2 MB",
    downloadCount: 0,
    format: "PDF",
  },
  {
    id: 5,
    title: "Scheme Implementation Progress",
    description:
      "Progress report on government scheme implementation and beneficiary coverage",
    type: "Schemes",
    generatedDate: "2024-12-16",
    generatedBy: "Program Manager",
    status: "Completed",
    fileSize: "4.7 MB",
    downloadCount: 156,
    format: "Excel",
  },
];

const insights = [
  {
    id: 1,
    title: "Farmer Registration Surge",
    description: "25% increase in farmer registrations compared to last month",
    impact: "High",
    category: "Registration",
    trend: "up",
    value: "+25%",
    recommendation: "Expand outreach programs to maintain momentum",
  },
  {
    id: 2,
    title: "Crop Yield Improvement",
    description: "Average yield increased by 12% across major crops",
    impact: "High",
    category: "Yield",
    trend: "up",
    value: "+12%",
    recommendation: "Share best practices with underperforming districts",
  },
  {
    id: 3,
    title: "Pest Control Effectiveness",
    description: "Pest control measures reduced crop damage by 18%",
    impact: "Medium",
    category: "Pest Control",
    trend: "up",
    value: "+18%",
    recommendation: "Continue current pest management strategies",
  },
  {
    id: 4,
    title: "Market Price Volatility",
    description: "Higher than normal price fluctuations observed",
    impact: "Medium",
    category: "Market",
    trend: "down",
    value: "±15%",
    recommendation: "Implement price stabilization measures",
  },
];

const reportMetrics = [
  { month: "Jul", generated: 12, downloaded: 145 },
  { month: "Aug", generated: 15, downloaded: 178 },
  { month: "Sep", generated: 18, downloaded: 203 },
  { month: "Oct", downloaded: 234, generated: 22 },
  { month: "Nov", generated: 25, downloaded: 267 },
  { month: "Dec", generated: 28, downloaded: 298 },
];

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState({});

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    );
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportTitle("");
      setReportType("");
      setDateRange({});
    }, 3000);
  };

  const formatDate = (date) => {
    if (!date) return "Select date";
    return date.toLocaleDateString();
  };

  // Chart configuration
  const reportMetricsConfig = {
    labels: reportMetrics.map((item) => item.month),
    datasets: [
      {
        label: "Reports Generated",
        data: reportMetrics.map((item) => item.generated),
        backgroundColor: "#2E7D32", // Primary color from new theme
      },
      {
        label: "Downloads",
        data: reportMetrics.map((item) => item.downloaded),
        backgroundColor: "#66BB6A", // Secondary color from new theme
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Reports & Insights
              </h1>
              <p className="text-sm text-muted-foreground">
                Generate and manage analytical reports
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
                <DialogHeader>
                  <DialogTitle>Generate New Report</DialogTitle>
                  <DialogDescription>
                    Create a custom report with specific parameters
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-title">Report Title</Label>
                    <Input
                      id="report-title"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder="Enter report title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="registration">
                          Registration Report
                        </SelectItem>
                        <SelectItem value="analytics">
                          Analytics Report
                        </SelectItem>
                        <SelectItem value="pest">
                          Pest Control Report
                        </SelectItem>
                        <SelectItem value="market">Market Analysis</SelectItem>
                        <SelectItem value="schemes">Schemes Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="flex space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from
                              ? formatDate(dateRange.from)
                              : "From date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) =>
                              setDateRange({ ...dateRange, from: date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.to
                              ? formatDate(dateRange.to)
                              : "To date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) =>
                              setDateRange({ ...dateRange, to: date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button
                      onClick={handleGenerateReport}
                      disabled={!reportTitle || !reportType || isGenerating}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isGenerating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          <span>Generating...</span>
                        </div>
                      ) : (
                        "Generate Report"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Total Reports",
                value: "156",
                change: "+12 this month",
                icon: FileText,
              },
              {
                title: "Downloads",
                value: "2,847",
                change: "+234 this week",
                icon: Download,
              },
              {
                title: "Active Users",
                value: "89",
                change: "+15 new users",
                icon: Users,
              },
              {
                title: "Insights Generated",
                value: "24",
                change: "+6 new insights",
                icon: BarChart3,
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
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {metric.value}
                      </p>
                      <p className="text-xs text-green-600">{metric.change}</p>
                    </div>
                    <metric.icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs Content */}
          <Tabs
            defaultValue="reports"
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports">Generated Reports</TabsTrigger>
              <TabsTrigger value="insights">Key Insights</TabsTrigger>
              <TabsTrigger value="analytics">Report Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <span>Filter Reports</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Types">All Types</SelectItem>
                        <SelectItem value="Registration">
                          Registration
                        </SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                        <SelectItem value="Pest Control">
                          Pest Control
                        </SelectItem>
                        <SelectItem value="Market">Market</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Status">All Status</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline">Reset Filters</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Reports List */}
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <Card
                    key={report.id}
                    className="animate-in fade-in-0 slide-in-from-left-2 hover:shadow-md transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">
                              {report.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={getStatusColor(report.status)}
                            >
                              {report.status}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {report.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {report.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span>Generated: {report.generatedDate}</span>
                            <span>By: {report.generatedBy}</span>
                            <span>Size: {report.fileSize}</span>
                            <span>Downloads: {report.downloadCount}</span>
                            <span>Format: {report.format}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 lg:ml-6">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            disabled={report.status !== "Completed"}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.map((insight, index) => (
                  <Card
                    key={insight.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getTrendIcon(insight.trend)}
                            <h3 className="font-semibold text-foreground">
                              {insight.title}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className={getImpactColor(insight.impact)}
                            >
                              {insight.impact} Impact
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {insight.category}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-lg font-bold text-primary">
                            {insight.value}
                          </span>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Recommendation
                          </p>
                          <p className="text-sm">{insight.recommendation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Generation & Download Trends</CardTitle>
                  <CardDescription>
                    Monthly statistics for report generation and downloads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "400px" }}>
                    <Bar data={reportMetricsConfig} options={chartOptions} />
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
