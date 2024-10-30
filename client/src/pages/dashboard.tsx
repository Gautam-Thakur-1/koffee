import useAuthStore from "../stores/useAuthStore";

const Dashboard = () => {
  const authStore: any = useAuthStore();

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Hello, {authStore.user.name}</p>
    </div>
  );
};

export default Dashboard;
