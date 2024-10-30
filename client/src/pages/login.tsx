import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { loginFormSchema as formSchema } from "../../schema";
import { ChevronLeft } from "lucide-react";
import useAuthStore from "../stores/useAuthStore";
import toast from "react-hot-toast";

const Login = () => {
  const authStore: any = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isEmail = values.usernameOrEmail.includes("@");

    const credentials = {
      isEmail,
      loginField: values.usernameOrEmail,
      password: values.password,
    };

    const response = await authStore.login(credentials);

    if (response.success) {
      toast.success("Logged in successfully");

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 1000);
    }

    if (!response.success) {
      toast.error(response.error);
    }

    form.reset();
  }

  return (
    <div className="w-full h-full flex items-center relative">
      <div className="hidden md:w-1/5 min-h-screen md:flex">
        <div className="z-10">
          <Link to={"/"}>
            <img
              src="../src/assets/logo.svg"
              alt="logo"
              className="absolute w-44 top-4 left-4"
            />
          </Link>
        </div>

        <video
          src="../src/assets/videos/login.webm"
          autoPlay
          muted
          loop
          className="w-full min-h-screen object-fill"
        ></video>

        <div className="absolute bottom-4 left-4">
          <p className="text-white text-xs">
            © 2024 Koffee. All rights reserved.
          </p>
        </div>
      </div>

      <div className="w-full md:w-3/4 min-h-screen flex items-center px-8 md:px-0 lg:items-start justify-center flex-col lg:ps-36 gap-y-4">
        <div className="w-full max-w-md flex flex-col justify-center">
          <h2 className="text-3xl font-bold my-4">Sign in to Koffee</h2>
          <Button variant="outline" className="w-full my-4">
            <img
              src="../src/assets/images/google.svg"
              alt=""
              className="w-6 mr-2 lg:mr-4"
            />
            Sign in with Google
          </Button>
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign in with email
              </span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username or email"
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
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#0d0c22] hover:bg-[#0d0c22]/90"
                disabled={authStore.loading}
              >
                Sign In
              </Button>
            </form>
          </Form>
          <Button variant={"link"} className="text-md my-4">
            <Link to={"/auth/register"}>Don't have an account? Sign up</Link>
          </Button>
        </div>
      </div>

      <div className="flex md:hidden absolute top-4 left-0">
        <Link to={"/"}>
          <Button className="" variant={"link"}>
            <ChevronLeft />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
