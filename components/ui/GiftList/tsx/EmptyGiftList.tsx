import React from "react";
import { Link } from "react-router-dom";
import { CachedLottie } from "@/components/ui/CachedLottie";
import styles from "../styles.module.scss";
import { useTranslation } from "react-i18next";
import { useRoutePath } from "@/components/providers/RoutesProvider";
import constant from "@/constants";

export const EmptyGiftList: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoutePath();
  const isProfile = route.startsWith("profile");

  return (
    <div className={styles.noGifts}>
      <div className={styles.noGiftsIcon}>
        <CachedLottie
          url={`${constant.ASSETS_PREFIX}/animations/ui/emoji-balloons.json`}
          styles={{
            width: "100%",
            height: "100%",
          }}
          loop={true}
        />
      </div>
      <p>{t(isProfile ? "gifts.noGiftsProfile" : "gifts.noGifts")}</p>
      <Link to="/">{t("gifts.openStore")}</Link>
    </div>
  );
};
