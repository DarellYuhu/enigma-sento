import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MultipleSelector from "@/components/ui/multipleselector";
import { useAddWorkgroupUsers } from "@/hooks/feature/use-add-workgroup-users";
import { useUsers } from "@/hooks/feature/use-users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const addWorkgroupUsers = z.object({
  users: z.array(z.object({ label: z.string(), value: z.string() })),
});

type AddWorkgroupUsers = z.infer<typeof addWorkgroupUsers>;

export const AddUserForm = () => {
  const { data } = useUsers();
  const { mutate } = useAddWorkgroupUsers();
  const form = useForm<AddWorkgroupUsers>({
    resolver: zodResolver(addWorkgroupUsers),
    defaultValues: { users: [] },
  });

  const options = useMemo(() => {
    return data?.data.map((user) => ({
      label: user.displayName,
      value: user.id,
    }));
  }, [data?.data]);

  const handleSubmittion = (data: AddWorkgroupUsers) => {
    mutate({ users: data.users.map((user) => user.value) });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmittion)}>
        <FormField
          control={form.control}
          name="users"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select new users</FormLabel>
              <FormControl>
                <MultipleSelector
                  commandProps={{
                    label: "Click to select",
                  }}
                  value={field.value}
                  onChange={field.onChange}
                  defaultOptions={options}
                  placeholder="Click to select"
                  hideClearAllButton
                  hidePlaceholderWhenSelected
                  emptyIndicator={
                    <p className="text-center text-sm">No results found</p>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full mt-2">Add</Button>
      </form>
    </Form>
  );
};
