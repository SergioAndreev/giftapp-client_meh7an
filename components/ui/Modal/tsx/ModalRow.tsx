import React from "react";
import styles from "../styles.module.scss";
import { CurrencyIcon } from "@/components/icons/currencies";
import { inputType } from "../parts/formUtils";
import Avatar from "../../Avatar";
import { SenderUserProps } from "../../GiftCard/types/giftCard.types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
interface ModalRowProps {
  index: number;
  keyName: string;
  value: string;
  currency?: string;
  sender?: SenderUserProps;
  formData: Record<string, string>;
  isLoading: boolean;
  onInputChange: (key: string, value: string) => void;
  closeModal: () => void;
}

export const ModalRow: React.FC<ModalRowProps> = ({
  index,
  keyName,
  value,
  currency,
  sender,
  formData,
  isLoading,
  onInputChange,
  closeModal,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <tr key={index} className={styles.row}>
      <th className={styles.label}>{keyName}</th>
      <td className={styles.value}>
        {["number", "string", "number+0"].includes(value) ||
        value.startsWith("file:") ? (
          <input
            {...inputType(value)}
            onChange={(e) => onInputChange(keyName, e.target.value)}
            value={formData[keyName] || ""}
            disabled={isLoading}
          />
        ) : (
          <div className={styles.valueContainer}>
            {keyName === t("modal.giftInfo.fields.price") && currency && (
              <div className={styles.currency}>
                <CurrencyIcon currency={currency} colored />
              </div>
            )}
            {keyName === t("modal.giftInfo.fields.from") && sender && (
              <>
                <Avatar user={sender} size={1.25} />{" "}
                <div
                  className={styles.link}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeModal();
                    setTimeout(() => {
                      navigate(`/profile/${sender.telegramId}`, {
                        state: { from: "/leaderboard/" },
                      });
                    }, 500);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {sender.firstName}
                </div>
              </>
            )}
            {keyName !== t("modal.giftInfo.fields.from") && (
              <span>{value}</span>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};
