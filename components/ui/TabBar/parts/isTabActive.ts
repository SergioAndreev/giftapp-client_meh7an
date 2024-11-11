import WebApp from "@twa-dev/sdk";

export const isTabActive = (route: string, currentPath: string = "") => {
  const routeArr = currentPath.split("/");
  if (routeArr.length > 1) {
    if (routeArr[0] === "profile") {
      if (
        parseInt(routeArr[1]) === (WebApp.initDataUnsafe?.user?.id as number)
      ) {
        return route === "profile";
      }
      return route === "leaderboard";
    }
  }
  return route === currentPath.replace("/", "");
};
