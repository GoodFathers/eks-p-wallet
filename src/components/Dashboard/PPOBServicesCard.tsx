import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Bolt,
  Droplets,
  Wifi,
  Smartphone,
  ArrowRight,
  Lock,
} from "lucide-react";

interface PPOBService {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface PPOBServicesCardProps {
  services?: PPOBService[];
  onSelectService?: (serviceId: string) => void;
}

const PPOBServicesCard = ({
  services = [
    {
      id: "electricity",
      name: "Electricity",
      icon: <Bolt className="h-6 w-6" />,
      description: "Pay your electricity bills",
    },
    {
      id: "water",
      name: "Water",
      icon: <Droplets className="h-6 w-6" />,
      description: "Pay your water bills",
    },
    {
      id: "internet",
      name: "Internet",
      icon: <Wifi className="h-6 w-6" />,
      description: "Pay your internet bills",
    },
    {
      id: "mobile",
      name: "Mobile Credits",
      icon: <Smartphone className="h-6 w-6" />,
      description: "Top up your mobile credits",
    },
  ],
  onSelectService = () => {},
}: PPOBServicesCardProps) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    onSelectService(serviceId);
  };

  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-bold">PPOB Services</CardTitle>
        <CardDescription>
          Pay your bills and top up credits with secure PIN validation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <Button
              key={service.id}
              variant="outline"
              className={`flex items-center justify-start p-4 h-auto ${selectedService === service.id ? "border-primary" : ""}`}
              onClick={() => handleServiceSelect(service.id)}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mr-3">
                {service.icon}
              </div>
              <div className="text-left">
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground flex items-center">
          <Lock className="h-4 w-4 mr-1" />
          <span>Secured with PIN validation</span>
        </div>
        <Button
          size="sm"
          className="flex items-center"
          disabled={!selectedService}
        >
          Proceed <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PPOBServicesCard;
