import { CachedLottie } from "@/components/ui/CachedLottie";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import constant from "@/constants";
import { useLoadPage } from "./hooks/useLoadPage";

const Successful: React.FC = () => {
  const { t } = useTranslation();

  const { isReceived, lottieID, name, price, currency } = useLoadPage();

  return (
    <div className={styles.container}>
      <div className={styles.giftContainer}>
        <div className={styles.giftIcon}>
          <CachedLottie
            url={`${constant.ASSETS_PREFIX}/animations/gifts/${lottieID}.json`}
            styles={{
              width: "100%",
              height: "100%",
            }}
            loop={false}
          />
        </div>
        <CachedLottie
          url={`${constant.ASSETS_PREFIX}/animations/overlays/effect-gift-purchased.json`}
          styles={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
          }}
          loop={false}
        />
      </div>
      <div className={styles.successDetails}>
        {isReceived && <h1>{t("successful.giftReceived")}</h1>}
        {!isReceived && <h1>{t("successful.giftPurchased")}</h1>}

        {isReceived && (
          <p>
            {t("successful.giftReceivedDescription", {
              name: name,
            })}
          </p>
        )}
        {!isReceived && (
          <p>
            {t("successful.giftPurchasedDescription", {
              name: name,
              price: price,
              currency: currency,
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default Successful;
