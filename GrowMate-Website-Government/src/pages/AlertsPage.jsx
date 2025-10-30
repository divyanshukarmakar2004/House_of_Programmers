import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
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
import { Checkbox } from "../components/ui/Checkbox";
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
  Bell,
  Send,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Menu,
  Plus,
  Filter,
} from "lucide-react";

const alertTypes = [
  {
    id: "weather",
    label: "Weather Alert",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  {
    id: "pest",
    label: "Pest Alert",
    icon: AlertTriangle,
    color: "text-red-500",
  },
  { id: "market", label: "Market Update", icon: Info, color: "text-blue-500" },
  {
    id: "scheme",
    label: "Scheme Notification",
    icon: CheckCircle,
    color: "text-green-500",
  },
  { id: "advisory", label: "Advisory", icon: Info, color: "text-purple-500" },
];

const districts = [
  "Angul",
  "Balangir",
  "Balasore",
  "Bargarh",
  "Bhadrak",
  "Bhubaneswar",
  "Bolangir",
  "Boudh",
  "Cuttack",
  "Deogarh",
  "Dhenkanal",
  "Gajapati",
  "Ganjam",
  "Jagatsinghpur",
  "Jajpur",
  "Jharsuguda",
  "Kalahandi",
  "Kandhamal",
  "Kendrapara",
  "Kendujhar",
  "Khordha",
  "Koraput",
  "Malkangiri",
  "Mayurbhanj",
  "Nabarangpur",
  "Nayagarh",
  "Nuapada",
  "Puri",
  "Rayagada",
  "Sambalpur",
  "Subarnapur",
  "Sundargarh",
];

const sentAlerts = [
  {
    id: 1,
    title: "Heavy Rainfall Warning",
    message:
      "Heavy to very heavy rainfall expected in coastal districts. Farmers advised to take precautionary measures for standing crops.",
    type: "weather",
    priority: "High",
    recipients: 15420,
    districts: ["Puri", "Balasore", "Bhadrak"],
    sentAt: "2024-12-20 14:30",
    status: "Delivered",
    deliveryRate: 98.5,
  },
  {
    id: 2,
    title: "Brown Plant Hopper Alert",
    message:
      "Brown plant hopper infestation detected in rice fields. Immediate spraying of recommended insecticides advised.",
    type: "pest",
    priority: "Critical",
    recipients: 8750,
    districts: ["Cuttack", "Khordha"],
    sentAt: "2024-12-19 09:15",
    status: "Delivered",
    deliveryRate: 96.2,
  },
  {
    id: 3,
    title: "PM-KISAN Registration Reminder",
    message:
      "Last date for PM-KISAN scheme registration is approaching. Complete your application before the deadline.",
    type: "scheme",
    priority: "Medium",
    recipients: 25600,
    districts: ["All Districts"],
    sentAt: "2024-12-18 16:45",
    status: "Delivered",
    deliveryRate: 94.8,
  },
  {
    id: 4,
    title: "Rice Price Update",
    message:
      "Rice prices have increased by 8% in major markets. Current rate: ₹2,850 per quintal in Bhubaneswar market.",
    type: "market",
    priority: "Low",
    recipients: 12300,
    districts: ["Bhubaneswar", "Cuttack", "Puri"],
    sentAt: "2024-12-17 11:20",
    status: "Delivered",
    deliveryRate: 97.1,
  },
];

const templates = [
  {
    id: 1,
    name: "Weather Alert Template",
    type: "weather",
    subject: "Weather Alert: {weather_type} Expected",
    message:
      "Dear Farmer,\n\n{weather_type} is expected in your area from {start_date} to {end_date}. Please take necessary precautions:\n\n• {precaution_1}\n• {precaution_2}\n• {precaution_3}\n\nFor more information, contact your local agriculture officer.\n\nRegards,\nElectronics & IT Department, Odisha",
  },
  {
    id: 2,
    name: "Pest Alert Template",
    type: "pest",
    subject: "Urgent: {pest_name} Alert",
    message:
      "Dear Farmer,\n\n{pest_name} has been detected in {crop_name} fields in your area. Immediate action required:\n\n• Spray {chemical_name} at {dosage}\n• Apply during {application_time}\n• Repeat after {repeat_interval} if necessary\n\nContact helpline: 1800-XXX-XXXX for assistance.\n\nRegards,\nElectronics & IT Department, Odisha",
  },
];

export default function AlertsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAlertType, setSelectedAlertType] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [isComposing, setIsComposing] = useState(false);
  const [filterType, setFilterType] = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All Status");

  const handleDistrictChange = (district, checked) => {
    if (checked) {
      setSelectedDistricts([...selectedDistricts, district]);
    } else {
      setSelectedDistricts(selectedDistricts.filter((d) => d !== district));
    }
  };

  const handleSendAlert = () => {
    // Simulate sending alert
    console.log("Sending alert:", {
      type: selectedAlertType,
      title: alertTitle,
      message: alertMessage,
      districts: selectedDistricts,
      priority,
    });

    // Reset form
    setSelectedAlertType("");
    setSelectedDistricts([]);
    setAlertTitle("");
    setAlertMessage("");
    setPriority("Medium");
    setIsComposing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    const alertType = alertTypes.find((t) => t.id === type);
    if (alertType) {
      const Icon = alertType.icon;
      return <Icon className={`h-4 w-4 ${alertType.color}`} />;
    }
    return <Info className="h-4 w-4 text-gray-500" />;
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
                Alerts & Notifications
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and send notifications to farmers
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isComposing} onOpenChange={setIsComposing}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Compose Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                <DialogHeader>
                  <DialogTitle>Compose New Alert</DialogTitle>
                  <DialogDescription>
                    Create and send notifications to farmers in selected regions
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Alert Type */}
                  <div className="space-y-2">
                    <Label htmlFor="alert-type">Alert Type</Label>
                    <Select
                      value={selectedAlertType}
                      onValueChange={setSelectedAlertType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select alert type" />
                      </SelectTrigger>
                      <SelectContent>
                        {alertTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center space-x-2">
                              <type.icon className={`h-4 w-4 ${type.color}`} />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Alert Title</Label>
                    <Input
                      id="title"
                      value={alertTitle}
                      onChange={(e) => setAlertTitle(e.target.value)}
                      placeholder="Enter alert title"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      placeholder="Enter alert message"
                      rows={6}
                    />
                  </div>

                  {/* District Selection */}
                  <div className="space-y-2">
                    <Label>Target Districts</Label>
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-border rounded-md p-3">
                      {districts.map((district) => (
                        <div
                          key={district}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={district}
                            checked={selectedDistricts.includes(district)}
                            onCheckedChange={(checked) =>
                              handleDistrictChange(district, checked)
                            }
                          />
                          <Label htmlFor={district} className="text-sm">
                            {district}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedDistricts.length} districts selected
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsComposing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendAlert}
                      disabled={
                        !selectedAlertType ||
                        !alertTitle ||
                        !alertMessage ||
                        selectedDistricts.length === 0
                      }
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Alert
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
                title: "Total Alerts Sent",
                value: "1,247",
                change: "+23 this week",
                icon: Bell,
              },
              {
                title: "Active Recipients",
                value: "24,847",
                change: "+156 new",
                icon: CheckCircle,
              },
              {
                title: "Delivery Rate",
                value: "96.8%",
                change: "+2.1% improvement",
                icon: Send,
              },
              {
                title: "Response Rate",
                value: "78.5%",
                change: "+5.3% increase",
                icon: Clock,
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
            defaultValue="sent"
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sent">Sent Alerts</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="sent" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <span>Filter Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Types">All Types</SelectItem>
                        {alertTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Status">All Status</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline">Reset Filters</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sent Alerts List */}
              <div className="space-y-4">
                {sentAlerts.map((alert, index) => (
                  <Card
                    key={alert.id}
                    className="animate-in fade-in-0 slide-in-from-left-2 hover:shadow-md transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-3">
                            {getTypeIcon(alert.type)}
                            <h3 className="text-lg font-semibold text-foreground">
                              {alert.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(alert.priority)}
                            >
                              {alert.priority}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-200"
                            >
                              {alert.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {alert.message}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {alert.districts.map((district) => (
                              <Badge
                                key={district}
                                variant="secondary"
                                className="text-xs"
                              >
                                {district}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right space-y-2 lg:ml-6">
                          <div className="text-sm">
                            <p className="font-medium text-foreground">
                              {alert.recipients.toLocaleString()} recipients
                            </p>
                            <p className="text-muted-foreground">
                              {alert.deliveryRate}% delivered
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {alert.sentAt}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template, index) => (
                  <Card
                    key={template.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {template.name}
                        </CardTitle>
                        {getTypeIcon(template.type)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Subject
                        </p>
                        <p className="text-sm bg-muted p-2 rounded">
                          {template.subject}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Message Template
                        </p>
                        <div className="text-sm bg-muted p-3 rounded max-h-32 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-xs">
                            {template.message}
                          </pre>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                        >
                          Edit Template
                        </Button>
                        <Button size="sm" className="flex-1">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Alert Distribution by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alertTypes.map((type, index) => (
                        <div
                          key={type.id}
                          className="animate-in fade-in-0 slide-in-from-left-2"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                              <type.icon className={`h-4 w-4 ${type.color}`} />
                              <span className="text-sm font-medium">
                                {type.label}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {Math.floor(Math.random() * 300) + 50}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${Math.random() * 80 + 20}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          label: "SMS Delivery",
                          rate: 98.5,
                          color: "bg-green-500",
                        },
                        {
                          label: "App Notifications",
                          rate: 94.2,
                          color: "bg-blue-500",
                        },
                        {
                          label: "Voice Calls",
                          rate: 87.8,
                          color: "bg-yellow-500",
                        },
                        {
                          label: "Email Delivery",
                          rate: 92.1,
                          color: "bg-purple-500",
                        },
                      ].map((metric, index) => (
                        <div
                          key={metric.label}
                          className="animate-in fade-in-0 slide-in-from-right-2"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              {metric.label}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {metric.rate}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`${metric.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${metric.rate}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
