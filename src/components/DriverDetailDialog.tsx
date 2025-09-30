import { useState } from "react";
import { Driver, FieldOption } from "@/types/driver";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { approveDriver, rejectDriver } from "@/services/driverApi";
import { CheckCircle2, XCircle } from "lucide-react";

interface DriverDetailDialogProps {
  driver: Driver | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const FIELD_OPTIONS: FieldOption[] = [
  { label: "Full Name", value: "fullname" },
  { label: "Username", value: "username" },
  { label: "Phone Number", value: "phone_number" },
  { label: "Secondary Phone", value: "phone_number2" },
  { label: "Car Model", value: "car_model" },
  { label: "Weight Capacity", value: "weight" },
  { label: "Car Image - Back", value: "car_image_back" },
  { label: "Car Image - Front", value: "car_image_front" },
  { label: "Car Image - Side 1", value: "car_image_side" },
  { label: "Car Image - Side 2", value: "car_image_side2" },
  { label: "Car Image - Inside", value: "car_image_inside" },
  { label: "Technical Passport - Front", value: "technical_passport_front" },
  { label: "Technical Passport - Back", value: "technical_passport_back" },
  { label: "Driving Licence - Front", value: "driving_licence_front" },
  { label: "Driving Licence - Back", value: "driving_licence_back" },
  { label: "Passport - Front", value: "passport_front" },
  { label: "Passport - Back", value: "passport_back" },
  { label: "Driver Photo", value: "own_picture" },
];

export const DriverDetailDialog = ({
  driver,
  open,
  onOpenChange,
  onSuccess,
}: DriverDetailDialogProps) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  const handleApprove = async () => {
    if (!driver) return;
    
    setIsSubmitting(true);
    try {
      await approveDriver(driver.telegram_id);
      toast.success("Driver approved successfully!");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error("Failed to approve driver");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!driver) return;
    
    if (selectedFields.length === 0) {
      toast.error("Please select at least one field that needs to be updated");
      return;
    }

    setIsSubmitting(true);
    try {
      const rejectReasons = selectedFields.map(
        (field) => FIELD_OPTIONS.find((opt) => opt.value === field)?.label || field
      );
      await rejectDriver(driver.telegram_id, rejectReasons);
      toast.success("Driver rejected successfully!");
      onOpenChange(false);
      setSelectedFields([]);
      onSuccess();
    } catch (error) {
      toast.error("Failed to reject driver");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!driver) return null;

  const ImageSection = ({ title, images }: { title: string; images: Array<{ label: string; url: string; field: string }> }) => (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm">{title}</h4>
      <div className="grid grid-cols-2 gap-4">
        {images.map((img) => (
          <div key={img.field} className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id={img.field}
                checked={selectedFields.includes(img.field)}
                onCheckedChange={() => handleFieldToggle(img.field)}
              />
              <label htmlFor={img.field} className="text-sm cursor-pointer">
                {img.label}
              </label>
            </div>
            <img
              src={img.url}
              alt={img.label}
              className="w-full h-32 object-cover rounded-lg border"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/300x200";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Driver Application Details</DialogTitle>
          <DialogDescription>
            Review driver information and select fields that need updates if rejecting
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="fullname"
                    checked={selectedFields.includes("fullname")}
                    onCheckedChange={() => handleFieldToggle("fullname")}
                  />
                  <label htmlFor="fullname" className="text-sm cursor-pointer">
                    <span className="font-medium">Full Name:</span> {driver.fullname}
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="username"
                    checked={selectedFields.includes("username")}
                    onCheckedChange={() => handleFieldToggle("username")}
                  />
                  <label htmlFor="username" className="text-sm cursor-pointer">
                    <span className="font-medium">Username:</span> @{driver.username}
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="phone_number"
                    checked={selectedFields.includes("phone_number")}
                    onCheckedChange={() => handleFieldToggle("phone_number")}
                  />
                  <label htmlFor="phone_number" className="text-sm cursor-pointer">
                    <span className="font-medium">Phone:</span> {driver.phone_number}
                  </label>
                </div>
                
                {driver.phone_number2 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="phone_number2"
                      checked={selectedFields.includes("phone_number2")}
                      onCheckedChange={() => handleFieldToggle("phone_number2")}
                    />
                    <label htmlFor="phone_number2" className="text-sm cursor-pointer">
                      <span className="font-medium">Phone 2:</span> {driver.phone_number2}
                    </label>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Vehicle Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Vehicle Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="car_model"
                    checked={selectedFields.includes("car_model")}
                    onCheckedChange={() => handleFieldToggle("car_model")}
                  />
                  <label htmlFor="car_model" className="text-sm cursor-pointer">
                    <span className="font-medium">Car Model:</span> {driver.car_model}
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="weight"
                    checked={selectedFields.includes("weight")}
                    onCheckedChange={() => handleFieldToggle("weight")}
                  />
                  <label htmlFor="weight" className="text-sm cursor-pointer">
                    <span className="font-medium">Weight Capacity:</span> {driver.weight}kg
                  </label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Current Status</h3>
              <div className="flex gap-2">
                <Badge variant={driver.is_active ? "default" : "secondary"}>
                  {driver.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant={driver.is_online ? "default" : "secondary"}>
                  {driver.is_online ? "Online" : "Offline"}
                </Badge>
                <Badge variant={driver.is_free ? "outline" : "secondary"}>
                  {driver.is_free ? "Available" : "Busy"}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Driver Photo */}
            <ImageSection
              title="Driver Photo"
              images={[
                { label: "Driver Photo", url: driver.own_picture, field: "own_picture" },
              ]}
            />

            <Separator />

            {/* Car Images */}
            <ImageSection
              title="Car Images"
              images={[
                { label: "Back", url: driver.car_image_back, field: "car_image_back" },
                { label: "Front", url: driver.car_image_front, field: "car_image_front" },
                { label: "Side 1", url: driver.car_image_side, field: "car_image_side" },
                { label: "Side 2", url: driver.car_image_side2, field: "car_image_side2" },
                { label: "Inside", url: driver.car_image_inside, field: "car_image_inside" },
              ]}
            />

            <Separator />

            {/* Technical Passport */}
            <ImageSection
              title="Technical Passport"
              images={[
                { label: "Front", url: driver.technical_passport_front, field: "technical_passport_front" },
                { label: "Back", url: driver.technical_passport_back, field: "technical_passport_back" },
              ]}
            />

            <Separator />

            {/* Driving Licence */}
            <ImageSection
              title="Driving Licence"
              images={[
                { label: "Front", url: driver.driving_licence_front, field: "driving_licence_front" },
                { label: "Back", url: driver.driving_licence_back, field: "driving_licence_back" },
              ]}
            />

            <Separator />

            {/* Passport */}
            <ImageSection
              title="Passport"
              images={[
                { label: "Front", url: driver.passport_front, field: "passport_front" },
                { label: "Back", url: driver.passport_back, field: "passport_back" },
              ]}
            />
          </div>
        </ScrollArea>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isSubmitting}
            className="gap-2"
          >
            <XCircle className="w-4 h-4" />
            Reject {selectedFields.length > 0 && `(${selectedFields.length})`}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve Driver
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
