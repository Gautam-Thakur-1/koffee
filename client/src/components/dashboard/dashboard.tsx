import greetUser from "../../lib/greet-user";
import useAuthStore from "../../stores/useAuthStore";

const Dashboard = () => {
  const authStore: any = useAuthStore();
  const user = authStore.user;

  return (
    <div className="w-full h-full p-4">
      <h1 className="font-bold text-xl">{greetUser(user?.name)}</h1>
    </div>
  );
};

export default Dashboard;
