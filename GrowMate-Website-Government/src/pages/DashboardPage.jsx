import React, { useState, useRef, useEffect } from "react";
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
import {
  Users,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  IndianRupee,
  Bell,
  Menu,
  Activity,
  X,
  Info,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { DashboardCharts } from "../components/DashboardCharts";
import { NotificationPanel } from "../components/NotificationPanel";
import { HeatmapWidget } from "../components/HeatmapWidget";
import { PieChart } from "../components/PieChart";

const dashboardStats = [
  {
    title: "Total Farmers Registered",
    value: "24,847",
    change: "+12.5%",
    changeType: "positive",
    icon: Users,
    color: "text-chart-1",
  },
  {
    title: "Active Crop Monitoring",
    value: "18,392",
    change: "+8.2%",
    changeType: "positive",
    icon: TrendingUp,
    color: "text-chart-2",
  },
  {
    title: "Pest Alerts (Active)",
    value: "127",
    change: "-15.3%",
    changeType: "negative",
    icon: AlertTriangle,
    color: "text-destructive",
  },
  {
    title: "Market Price Updates",
    value: "₹2,45,680",
    change: "+5.7%",
    changeType: "positive",
    icon: IndianRupee,
    color: "text-chart-4",
  },
];

const recentActivities = [
  {
    id: 1,
    title: "New farmer registration in Cuttack district",
    time: "2 minutes ago",
    type: "registration",
  },
  {
    id: 2,
    title: "Pest alert issued for Bhubaneswar region",
    time: "15 minutes ago",
    type: "alert",
  },
  {
    id: 3,
    title: "Market price updated for Rice (Basmati)",
    time: "1 hour ago",
    type: "market",
  },
  {
    id: 4,
    title: "Weather advisory sent to 5,000+ farmers",
    time: "2 hours ago",
    type: "advisory",
  },
];

// Notification data
const notifications = [
  {
    id: 1,
    title: "Weather Alert: Heavy Rainfall Expected",
    message:
      "Monsoon alert issued for coastal districts. Farmers advised to take precautionary measures.",
    type: "warning",
    time: "5 minutes ago",
    priority: "high",
  },
  {
    id: 2,
    title: "New Subsidy Scheme Launched",
    message:
      "PM-KISAN beneficiary registration now open. Apply before the deadline.",
    type: "info",
    time: "2 hours ago",
    priority: "medium",
  },
  {
    id: 3,
    title: "Pest Control Advisory Sent",
    message:
      "Brown plant hopper control measures sent to 15,000+ farmers in affected areas.",
    type: "success",
    time: "1 day ago",
    priority: "low",
  },
];

// Helper functions for notification display
const getNotificationIcon = (type) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "info":
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
    default:
      return "bg-green-100 text-green-800 border-green-200";
  }
};

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  // Close notification popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card  border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="hover:bg-[#66BB6A]/20 hover:text-[#2E7D32]"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <img src="/logo.png" alt="logo" className="h-15 w-15" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Department of Agriculture & Farmers
              </h1>
              <p className="text-sm text-muted-foreground">
                Government of India
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="relative bg-transparent"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
              
              {/* Notification Popup */}
              {notificationOpen && (
                <div 
                  ref={notificationRef}
                  className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border border-border z-50 animate-in fade-in-0 slide-in-from-top-5 duration-300"
                >
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => setNotificationOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="p-3 border-b border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                              <Badge
                                variant="outline"
                                className={`text-xs ${getPriorityColor(notification.priority)}`}
                              >
                                {notification.priority}
                              </Badge>
                              <span>{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2">
                    <Button variant="outline" size="sm" className="w-full bg-transparent text-xs">
                      View All Notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">
                Department Officer
              </p>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <Card
                key={stat.title}
                className="animate-in fade-in-0 slide-in-from-bottom-4 hover:shadow-green-800 transition-all duration-300 hover:-translate-y-1 bg-[#e9ffe4]/45"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span
                      className={
                        stat.changeType === "positive"
                          ? "text-chart-1"
                          : "text-destructive"
                      }
                    >
                      {stat.change}
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts and Heatmap Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Heatmap Widget */}
            <HeatmapWidget />

            {/* Notifications Panel */}
            <NotificationPanel />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-6">
              <DashboardCharts /> 
            </div>

            <div className="flex flex-col space-y-6">
              <Card className="animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-500 bg-[#fff3d4]/45">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Recent Activities</span>
                  </CardTitle>
                  <CardDescription>
                    Latest updates from the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 animate-in fade-in-0 slide-in-from-right-2"
                        style={{ animationDelay: `${600 + index * 100}ms` }}
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <PieChart />
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700 bg-[#fff3d4]/45">
              <CardHeader>
                <CardTitle className="text-sm">Scheme Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>PM-KISAN</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-800 bg-[#fff3d4]/45">
              <CardHeader>
                <CardTitle className="text-sm">Data Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Crop Survey</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-900 bg-[#fff3d4]/45">
              <CardHeader>
                <CardTitle className="text-sm">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Server Status</span>
                    <span>99%</span>
                  </div>
                  <Progress value={99} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

