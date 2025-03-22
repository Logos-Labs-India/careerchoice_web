import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  grade: z.string({ required_error: "Please select your grade" }),
  school: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function CompleteProfilePage() {
  const { user, isLoading, completeProfileMutation } = useAuth();
  const [location] = useLocation();
  
  // Get user ID from query parameter if available
  const params = new URLSearchParams(location.split('?')[1] || '');
  const userId = params.get('id');
  
  // Profile completion form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNumber: "",
      grade: "",
      school: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: ProfileFormValues) => {
    completeProfileMutation.mutate(values);
  };

  // If user is already logged in and has completed profile, redirect to dashboard
  if (!isLoading && user && user.phoneNumber && user.grade) {
    return <Redirect to="/dashboard" />;
  }

  // If not authenticated and no userId in URL, redirect to login
  if (!isLoading && !user && !userId) {
    return <Redirect to="/auth" />;
  }

  const gradeOptions = [
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" },
    { value: "college_freshman", label: "College Freshman" },
    { value: "college_sophomore", label: "College Sophomore" },
    { value: "college_junior", label: "College Junior" },
    { value: "college_senior", label: "College Senior" },
    { value: "graduate", label: "Graduate Student" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="flex min-h-screen justify-center items-center bg-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide a few more details to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your phone number will be used for account recovery only
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Grade/Year</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your grade/year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {gradeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This helps us customize career recommendations for you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School/Institution (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your school or institution name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={completeProfileMutation.isPending}
                >
                  {completeProfileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving profile...
                    </>
                  ) : "Complete Profile"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-muted-foreground">
            This information helps us provide more accurate career recommendations
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}