import { Driver } from "@/types/driver";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Car, Phone } from "lucide-react";

interface DriverCardProps {
  driver: Driver;
  onClick: () => void;
}

export const DriverCard = ({ driver, onClick }: DriverCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={driver.own_picture}
              alt={driver.fullname}
              className="w-20 h-20 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/80";
              }}
            />
            {driver.is_active && (
              <Badge className="absolute -top-2 -right-2 bg-success text-success-foreground">
                Active
              </Badge>
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{driver.fullname}</h3>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Car className="w-4 h-4" />
              <span>{driver.car_model}</span>
              <Badge variant="secondary">{driver.weight}kg</Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{driver.phone_number}</span>
            </div>
            
            <div className="flex gap-2 mt-2">
              <Badge variant={driver.is_online ? "default" : "secondary"}>
                {driver.is_online ? "Online" : "Offline"}
              </Badge>
              <Badge variant={driver.is_free ? "outline" : "secondary"}>
                {driver.is_free ? "Available" : "Busy"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
