import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  CheckCircle2,
  Zap,
  Droplets,
  Wifi,
  Smartphone,
} from "lucide-react";

const formSchema = z.object({
  serviceType: z.string({
    required_error: "Please select a service type",
  }),
  accountNumber: z.string().min(5, {
    message: "Account number must be at least 5 characters",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a valid number greater than 0",
  }),
  customerName: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
  onSubmit?: (values: ServiceFormValues) => void;
  isOpen?: boolean;
}

const ServiceForm = ({ onSubmit, isOpen = true }: ServiceFormProps) => {
  const [showPINDialog, setShowPINDialog] = useState(false);
  const [currentService, setCurrentService] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormValues | null>(null);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "",
      accountNumber: "",
      amount: "",
      customerName: "",
      phoneNumber: "",
    },
  });

  const handleSubmit = (values: ServiceFormValues) => {
    setFormData(values);
    setShowPINDialog(true);
    // If onSubmit is provided, it will be called after PIN validation
  };

  const handlePINValidation = (isValid: boolean) => {
    if (isValid && formData && onSubmit) {
      onSubmit(formData);
    }
    setShowPINDialog(false);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "electricity":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "water":
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case "internet":
        return <Wifi className="h-5 w-5 text-purple-500" />;
      case "mobile":
        return <Smartphone className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getServiceFields = () => {
    const commonFields = (
      <>
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account/Bill Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter account or bill number" {...field} />
              </FormControl>
              <FormDescription>
                Enter the account or bill number associated with your service.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {currentService === "mobile" ? (
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the phone number for mobile credit top-up.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the name registered with this account (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (Rp)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter amount"
                  {...field}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter the payment amount in Indonesian Rupiah.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );

    return commonFields;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          PPOB Service Payment
        </CardTitle>
        <CardDescription>
          Pay your bills or top up mobile credits securely through our platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setCurrentService(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electricity">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span>Electricity Bill</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="water">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span>Water Bill</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="internet">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4 text-purple-500" />
                          <span>Internet Bill</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="mobile">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-green-500" />
                          <span>Mobile Credit</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of service you want to pay for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {currentService && getServiceFields()}

            <Button type="submit" className="w-full">
              Continue to Payment
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-gray-500">
          All transactions are secured with PIN validation.
        </p>
      </CardFooter>

      {/* PIN Validation Dialog */}
      <Dialog open={showPINDialog} onOpenChange={setShowPINDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter PIN to Confirm Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center space-y-2">
              {currentService && (
                <div className="flex items-center space-x-2 mb-4">
                  {getServiceIcon(currentService)}
                  <span className="font-medium">
                    {currentService.charAt(0).toUpperCase() +
                      currentService.slice(1)}{" "}
                    Payment
                  </span>
                </div>
              )}

              <div className="grid grid-cols-6 gap-2 w-full max-w-xs">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Input
                      key={i}
                      type="password"
                      maxLength={1}
                      className="w-10 h-10 text-center"
                      inputMode="numeric"
                    />
                  ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Enter your 6-digit PIN to authorize this transaction
              </p>
            </div>
          </div>
          <div className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setShowPINDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => handlePINValidation(true)}>
              Confirm Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ServiceForm;
