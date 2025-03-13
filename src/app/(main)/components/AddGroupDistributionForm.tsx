import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createGroupDistribution,
  CreateGroupDistribution,
  useAddGroupDistribution,
} from "@/hooks/feature/workgroup/use-add-group-distribution";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";

export const AddGroupDistributionForm = () => {
  const { mutate, isPending } = useAddGroupDistribution();
  const id = useId();
  const form = useForm<CreateGroupDistribution>({
    resolver: zodResolver(createGroupDistribution),
    defaultValues: {
      file: undefined,
    },
  });

  const handleSubmittion = (data: CreateGroupDistribution) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmittion)}>
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel />
              <FormControl>
                <Input
                  id={id}
                  className="p-2 file:me-3 file:border-0 file:border-e"
                  type="file"
                  onChange={(e) =>
                    e.target.files?.[0] && field.onChange(e.target.files[0])
                  }
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};
