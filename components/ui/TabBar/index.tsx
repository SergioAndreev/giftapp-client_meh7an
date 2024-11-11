import { useNavigate } from "react-router-dom";
import { useRoutePath } from "@/components/providers/RoutesProvider";
import { TabBarContainer } from "./tsx/TabBarContainer";
import { useTabBarLogic } from "./hooks/useTabBarLogic";
import { TabBarItem } from "./tsx/TabBarItem";
import { useTabConfigs } from "./parts/tabConfigs";

export default function TabBar() {
  const currentPath = useRoutePath();
  const previousPath = useRoutePath(-1);
  const navigate = useNavigate();

  const tabConfigs = useTabConfigs();

  if (!tabConfigs.length) {
    return <></>;
  }

  const { tabsData, isVisible } = useTabBarLogic(
    currentPath,
    previousPath,
    tabConfigs
  );

  return (
    <TabBarContainer isVisible={isVisible}>
      {tabsData.map((tab) => (
        <TabBarItem
          key={tab.label}
          tab={tab}
          currentPath={currentPath}
          navigate={navigate}
        />
      ))}
    </TabBarContainer>
  );
}
