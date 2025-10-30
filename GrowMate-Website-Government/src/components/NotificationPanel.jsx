import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Bell, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";

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
  {
    id: 4,
    title: "Market Price Update",
    message:
      "Rice prices increased by 8% in Bhubaneswar market. Updated rates available.",
    type: "info",
    time: "2 days ago",
    priority: "medium",
  },
];

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

export function NotificationPanel() {
  return (
    <Card className="animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-400 bg-[#fff3d4]/45">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Recent Notifications</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {notifications.length} new
          </Badge>
        </CardTitle>
        <CardDescription>
          Latest alerts and updates from the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors animate-in fade-in-0 slide-in-from-right-2"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium text-foreground line-clamp-1">
                    {notification.title}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`text-xs ml-2 ${getPriorityColor(
                      notification.priority
                    )}`}
                  >
                    {notification.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{notification.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

