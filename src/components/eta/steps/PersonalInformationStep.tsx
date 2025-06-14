
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  gender: z.string({ required_error: "Please select a gender." }),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
  countryOfBirth: z.string().min(2, { message: "Country of birth is required." }),
  nationality: z.string().min(2, { message: "Nationality is required." }),
});

interface PersonalInformationStepProps {
  onNext: (data: z.infer<typeof formSchema>) => void;
  formData: any;
}

export const PersonalInformationStep: React.FC<PersonalInformationStepProps> = ({ onNext, formData }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: formData.fullName || '',
      gender: formData.gender || undefined,
      dateOfBirth: formData.dateOfBirth || '',
      countryOfBirth: formData.countryOfBirth || '',
      nationality: formData.nationality || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="countryOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Birth</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your country of birth" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your nationality" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
};
