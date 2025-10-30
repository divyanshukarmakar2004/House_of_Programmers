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
import { Alert, AlertDescription, AlertTitle } from "../components/ui/Alert";
import { Sidebar } from "../components/Sidebar";
import { Bug, AlertTriangle, MapPin, Menu, Bell, Shield } from "lucide-react";
import CropHealthMap from "./CropHealthMap";


const pestOutbreaks = [
  {
    id: 1,
    pest: "Brown Plant Hopper",
    crop: "Rice",
    district: "Cuttack",
    severity: "High",
    affectedArea: "2,500 Ha",
    reportedDate: "2024-12-18",
    status: "Active",
    farmers: 450,
  },
  {
    id: 2,
    pest: "Stem Borer",
    crop: "Rice",
    district: "Puri",
    severity: "Medium",
    affectedArea: "1,800 Ha",
    reportedDate: "2024-12-15",
    status: "Controlled",
    farmers: 320,
  },
  {
    id: 3,
    pest: "Aphids",
    crop: "Wheat",
    district: "Bhubaneswar",
    severity: "Low",
    affectedArea: "900 Ha",
    reportedDate: "2024-12-12",
    status: "Monitoring",
    farmers: 180,
  },
  {
    id: 4,
    pest: "Leaf Curl Virus",
    crop: "Tomato",
    district: "Khordha",
    severity: "High",
    affectedArea: "1,200 Ha",
    reportedDate: "2024-12-10",
    status: "Treatment",
    farmers: 280,
  },
];

const diseaseAlerts = [
  {
    id: 1,
    disease: "Blast Disease",
    crop: "Rice",
    symptoms: "Brown spots on leaves, neck rot",
    prevention: "Use resistant varieties, proper drainage",
    treatment: "Fungicide spray (Tricyclazole)",
    severity: "High",
  },
  {
    id: 2,
    disease: "Powdery Mildew",
    crop: "Wheat",
    symptoms: "White powdery growth on leaves",
    prevention: "Avoid overcrowding, proper ventilation",
    treatment: "Sulfur-based fungicides",
    severity: "Medium",
  },
  {
    id: 3,
    disease: "Bacterial Wilt",
    crop: "Tomato",
    symptoms: "Wilting, yellowing of leaves",
    prevention: "Crop rotation, soil sterilization",
    treatment: "Copper-based bactericides",
    severity: "High",
  },
];

const weatherAdvisories = [
  {
    id: 1,
    title: "Heavy Rainfall Alert",
    description:
      "Expected heavy rainfall in coastal districts may increase fungal disease risk",
    districts: ["Puri", "Balasore", "Bhadrak"],
    validUntil: "2024-12-25",
    priority: "High",
  },
  {
    id: 2,
    title: "Temperature Rise Warning",
    description: "Rising temperatures favorable for pest multiplication",
    districts: ["Cuttack", "Khordha", "Nayagarh"],
    validUntil: "2024-12-30",
    priority: "Medium",
  },
];

const treatmentRecommendations = [
  {
    pest: "Brown Plant Hopper",
    chemical: "Imidacloprid 17.8% SL",
    dosage: "0.3 ml/L water",
    application: "Foliar spray during evening hours",
    frequency: "2-3 applications at 10-day intervals",
  },
  {
    pest: "Stem Borer",
    chemical: "Chlorantraniliprole 18.5% SC",
    dosage: "0.4 ml/L water",
    application: "Spray on whorl and stem",
    frequency: "Apply at early infestation stage",
  },
];

export default function PestTrackingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedSeverity, setSelectedSeverity] = useState("All Severity");

  const getSeverityColor = (severity) => {
    switch (severity) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800 border-red-200";
      case "Controlled":
        return "bg-green-100 text-green-800 border-green-200";
      case "Monitoring":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Treatment":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
                Pest & Disease Tracking
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitor and manage crop health threats
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="animate-pulse">
              {pestOutbreaks.filter((p) => p.status === "Active").length} Active
              Outbreaks
            </Badge>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Alert Banner */}
          <Alert className="animate-in fade-in-0 slide-in-from-top-4 duration-500 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Critical Alert</AlertTitle>
            <AlertDescription className="text-red-700">
              Brown Plant Hopper outbreak detected in Cuttack district affecting
              2,500 Ha. Immediate action required.
            </AlertDescription>
          </Alert>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Active Outbreaks",
                value: "4",
                change: "+2 this week",
                icon: Bug,
                color: "text-red-500",
              },
              {
                title: "Affected Area",
                value: "6.4K Ha",
                change: "+15% from last month",
                icon: MapPin,
                color: "text-orange-500",
              },
              {
                title: "Farmers Impacted",
                value: "1,230",
                change: "+8% this week",
                icon: AlertTriangle,
                color: "text-yellow-500",
              },
              {
                title: "Control Rate",
                value: "78%",
                change: "+12% improvement",
                icon: Shield,
                color: "text-green-500",
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
                      <p className="text-xs text-muted-foreground">
                        {metric.change}
                      </p>
                    </div>
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="animate-in fade-in-0 slide-in-from-top-4 duration-700 delay-200">
            <CardHeader>
              <CardTitle>Filter Outbreaks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={selectedDistrict}
                  onValueChange={setSelectedDistrict}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Districts">All Districts</SelectItem>
                    <SelectItem value="Cuttack">Cuttack</SelectItem>
                    <SelectItem value="Puri">Puri</SelectItem>
                    <SelectItem value="Bhubaneswar">Bhubaneswar</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedSeverity}
                  onValueChange={setSelectedSeverity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Severity">All Severity</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">Reset Filters</Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs
            defaultValue="weather"
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="weather">Pest HeatMap</TabsTrigger>
              <TabsTrigger value="outbreaks">Active Outbreaks</TabsTrigger>
              <TabsTrigger value="diseases">Disease Alerts</TabsTrigger>
              <TabsTrigger value="treatment">Treatment Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="outbreaks" className="space-y-4">
              {pestOutbreaks.map((outbreak, index) => (
                <Card
                  key={outbreak.id}
                  className="animate-in fade-in-0 slide-in-from-left-2 hover:shadow-md transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {outbreak.pest}
                          </h3>
                          <Badge
                            variant="outline"
                            className={getSeverityColor(outbreak.severity)}
                          >
                            {outbreak.severity}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={getStatusColor(outbreak.status)}
                          >
                            {outbreak.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium">Crop</p>
                            <p>{outbreak.crop}</p>
                          </div>
                          <div>
                            <p className="font-medium">District</p>
                            <p>{outbreak.district}</p>
                          </div>
                          <div>
                            <p className="font-medium">Affected Area</p>
                            <p>{outbreak.affectedArea}</p>
                          </div>
                          <div>
                            <p className="font-medium">Farmers</p>
                            <p>{outbreak.farmers}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">
                          <Bell className="h-4 w-4 mr-2" />
                          Send Alert
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="diseases" className="space-y-4">
              {diseaseAlerts.map((disease, index) => (
                <Card
                  key={disease.id}
                  className="animate-in fade-in-0 slide-in-from-right-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {disease.disease}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={getSeverityColor(disease.severity)}
                      >
                        {disease.severity} Risk
                      </Badge>
                    </div>
                    <CardDescription>
                      Affecting {disease.crop} crops
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">
                          Symptoms
                        </h4>
                        <p className="text-sm">{disease.symptoms}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">
                          Prevention
                        </h4>
                        <p className="text-sm">{disease.prevention}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">
                          Treatment
                        </h4>
                        <p className="text-sm">{disease.treatment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="weather" className="space-y-4">
              <div className="card">
              <h2 className="text-xl font-semibold mb-4">Crop Health Heatmap</h2>
              <CropHealthMap />
              </div>
            </TabsContent>

            <TabsContent value="treatment" className="space-y-4">
              {treatmentRecommendations.map((treatment, index) => (
                <Card
                  key={treatment.pest}
                  className="animate-in fade-in-0 slide-in-from-left-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {treatment.pest} Treatment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">
                            Recommended Chemical
                          </h4>
                          <p className="text-sm font-medium">
                            {treatment.chemical}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">
                            Dosage
                          </h4>
                          <p className="text-sm">{treatment.dosage}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">
                            Application Method
                          </h4>
                          <p className="text-sm">{treatment.application}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">
                            Frequency
                          </h4>
                          <p className="text-sm">{treatment.frequency}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
