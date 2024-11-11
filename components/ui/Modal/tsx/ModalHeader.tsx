import React from "react";
import styles from "../styles.module.scss";
import { CachedLottie } from "../../CachedLottie";
import Cross from "@/components/icons/general/Cross";
import SparkleEffect from "../../SparkleEffect";
import constant from "@/constants";

interface ModalHeaderProps {
  headerImage: string | false;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  headerImage,
  onClose,
}) => (
  <>
    <div
      className={styles.closeButton}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <Cross />
    </div>
    {headerImage && (
      <div className={styles.headerArea}>
        <div className={styles.headerImageOverlay}>
          <SparkleEffect />
        </div>
        <div className={styles.headerImage}>
          <CachedLottie
            url={`${constant.ASSETS_PREFIX}/animations/gifts/${headerImage}.json`}
            styles={{
              width: "100%",
              height: "100%",
            }}
            loop={true}
            backAndForth={true}
          />
        </div>
      </div>
    )}
  </>
);
