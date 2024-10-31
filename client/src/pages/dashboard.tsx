import UserNav from "../components/navigation/user-nav";
import useAuthStore from "../stores/useAuthStore";

const Dashboard = () => {
  const authStore: any = useAuthStore();
  
  return (
    <>
      <UserNav />
    <div className="mx-auto lg:max-w-7xl h-full">

      <p>Hello, {authStore.user.name}</p>
    </div>
    </>
  );
};

export default Dashboard;
