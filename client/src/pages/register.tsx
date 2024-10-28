import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const Register = () => {
  return (
    <div className="w-full h-full flex items-center">
      <div className="hidden md:w-1/4 min-h-screen md:flex">
        <div>
          <img
            src="../src/assets/logo.svg"
            alt="logo"
            className="absolute w-44 top-4 left-4"
          />
        </div>

        <video
          src="../src/assets/videos/login.webm"
          autoPlay
          muted
          loop
          className="w-full min-h-screen object-fill"
        ></video>
      </div>

      <div className="w-full md:w-3/4 min-h-screen flex items-center lg:items-start justify-center flex-col lg:ps-36">
        <div className="w-1/2">
          <h1 className="text-xl my-2">Welcome!</h1>
          <h1 className="text-3xl font-bold">Sign up to Koffee</h1>

          <div className="flex my-8 flex-col gap-y-4">
            <Button className="rounded-full bg-black md:w-64 lg:w-96 h-14 flex text-md items-center justify-center text-white">
              <img
                src="../src/assets/images/google.svg"
                alt=""
                className="w-6 mr-2 lg:mr-4"
              />
              <p>Sign up with Google</p>
            </Button>

            <div className="flex items-center mx-4">
              <hr className="w-full md:w-28 lg:w-44 border border-neutral-200" />
              <p className="text-neutral-500 mx-2">or</p>
              <hr className="w-full md:w-28 lg:w-44 border border-neutral-200" />
            </div>

            <Button
              variant={"secondary"}
              className="rounded-full bg-neutral-100 md:w-64 lg:w-96 h-14 flex text-md items-center justify-center text-black"
            >
              Continue with Email
            </Button>

            <div className="flex flex-col items-center lg:w-96 md:w-64 gap-y-3 my-8">
              <p className="md:w-64 lg:w-96 text-zinc-700 text-xs text-center line-clamp-3 m-0 p-0">
                By creating an account you agree with our{" "}
                <Link
                  to="/rule/terms-condition"
                  className="text-xs text-zinc-700 underline"
                >
                  Terms of Service
                </Link>
                ,{" "}
                <Link
                  to="/rule/privacy-policy"
                  className="text-xs text-zinc-700 underline"
                >
                  Privacy Policy
                </Link>
                , and our default{" "}
                <Link
                  to="/rule/notification"
                  className="text-xs text-zinc-700 underline"
                >
                  Notification
                </Link>{" "}
                Settings.
              </p>

              <Button variant={"link"} className="text-md">
                <Link to={"/auth/login"}>Already have an account? Log in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
