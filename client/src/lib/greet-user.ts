const greetUser = (name: string) => {
  const currentTime = new Date().getHours();
  let greeting = "";
  if (currentTime < 12) {
    greeting = "Good morning";
  } else if (currentTime < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return `${greeting}, ${name}!`;
};

export default greetUser;
