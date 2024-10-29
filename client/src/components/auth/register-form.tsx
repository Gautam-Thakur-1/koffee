import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Link } from "react-router-dom";
import { registerFormSchema as formSchema } from "../../../schema";
import toast from "react-hot-toast";
import { registerUser } from "../../actions/user-actions";

const RegisterForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const avatar = `https://api.dicebear.com/9.x/dylan/svg?seed=${encodeURIComponent(
      values.username
    )}&size=64`;

    try {
      const res = await registerUser(
        values.name,
        values.username,
        values.email,
        values.password,
        avatar
      );

      if (res.success === true) {
        toast.success("Account created successfully");

        // Redirect user to login page
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      }
    } catch (error) {
      console.log("REGISTER_FORM_ERROR", error);
      toast.error("Internal server error");
    }
  }

  return (
    <div className="w-full max-w-md py-4 flex flex-col items-center px-8 md:px-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="6+ characters"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree with Koffee's{" "}
                    <Link to="#" className="underline">
                      Terms of Service
                    </Link>
                    ,{" "}
                    <Link to="#" className="underline">
                      Privacy Policy
                    </Link>
                    , and default{" "}
                    <Link to="#" className="underline">
                      Notification Settings
                    </Link>
                    .
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-[#0d0c22] hover:bg-[#0d0c22]/90"
          >
            Create Account
          </Button>
        </form>
      </Form>
      <Button variant={"link"} className="text-md my-4">
        <Link to={"/auth/login"}>Already have an account? Log in</Link>
      </Button>
    </div>
  );
};

export default RegisterForm;
