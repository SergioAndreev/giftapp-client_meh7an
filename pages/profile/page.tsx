import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe } from "@/lib/fetch/user";
import { User } from "@/types/types";

const App: React.FC = () => {
  const [user, setUser] = useState<User | undefined>();
  const navigate = useNavigate();
  useEffect(() => {
    fetchMe(setUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    navigate(`/profile/${user.telegramId}`, {
      state: {
        telegramId: user.telegramId,
        firstName: user.firstName,
        rank: user.rank,
        totalGiftsCount: user.totalGiftsCount,
        isMe: true,
      },
    });
  }, [user]);

  return <div className="container"></div>;
};

export default App;
