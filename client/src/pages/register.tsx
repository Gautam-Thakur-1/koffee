import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useState } from "react";
import RegisterForm from "../components/auth/register-form";
import { ChevronLeft } from "lucide-react";

const Register = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-full flex items-center relative">
      <div className="hidden md:w-1/3 lg:w-1/4 min-h-screen md:flex">
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
          src="../src/assets/videos/register.webm"
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

      <div className="relative w-full">
        {open ? (
          <>
            <button
              className="absolute top-4 left-4 flex items-center justify-center w-12 h-12 rounded-full border hover:bg-neutral-100"
              onClick={() => setOpen(false)}
            >
              <ChevronLeft />
            </button>

            <div className="w-full md:w-3/4 min-h-screen flex items-center lg:items-start justify-center flex-col lg:ps-36 gap-y-4">
              <h1 className="text-3xl font-bold">Sign up to Koffee</h1>

              <RegisterForm />
            </div>
          </>
        ) : (
          <div className="w-full md:w-3/4 min-h-screen flex items-center lg:items-start justify-center flex-col lg:ps-36">
            <div className="md:w-1/2 px-8 md:px-0">
              <h1 className="text-xl my-2">Welcome!</h1>
              <h1 className="text-3xl font-bold">Sign up to Koffee</h1>

              <div className="flex my-8 flex-col gap-y-4">
                <Button className="rounded-full bg-black md:w-64 lg:w-96 h-14 flex sm:text-md items-center justify-center text-white">
                  <img
                    src="../src/assets/images/google.svg"
                    alt=""
                    className="w-6 mr-2 lg:mr-4"
                  />
                  <p>Sign up with Google</p>
                </Button>

                <div className="flex items-center mx-4">
                  <hr className="w-full md:w-28 lg:w-40 border border-neutral-200" />
                  <p className="text-neutral-500 mx-2">or</p>
                  <hr className="w-full md:w-28 lg:w-40 border border-neutral-200" />
                </div>

                <Button
                  variant={"secondary"}
                  className="rounded-full bg-neutral-100 md:w-64 lg:w-96 h-14 flex sm:text-md items-center justify-center text-black"
                  onClick={() => setOpen(true)}
                >
                  Continue with Email
                </Button>

                <div className="flex flex-col items-center lg:w-96 md:w-64 gap-y-3 my-8">
                  <p className="md:w-64 lg:w-96 text-zinc-700 text-xs text-center line-clamp-3 m-0 p-0">
                    By creating an account you agree with our{" "}
                    <Link to="#" className="text-xs text-zinc-700 underline">
                      Terms of Service
                    </Link>
                    ,{" "}
                    <Link to="#" className="text-xs text-zinc-700 underline">
                      Privacy Policy
                    </Link>
                    , and our default{" "}
                    <Link to="#" className="text-xs text-zinc-700 underline">
                      Notification
                    </Link>{" "}
                    Settings.
                  </p>

                  <Button variant={"link"} className="text-md">
                    <Link to={"/auth/login"}>
                      Already have an account? Log in
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default Register;
