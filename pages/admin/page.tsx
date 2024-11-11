import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

// hooks
import { useNavigate } from "react-router-dom";
import useAdminStatus from "./hooks/useAdminStatus";
import useLoadData from "./hooks/useLoadData";
import useAddButton from "./hooks/useAddButton";
import { useModal } from "@/components/ui/Modal/hooks/useModal";

// handlers
import { handleAddAdmin } from "./handlers/handleAddAdmin";
import { handleAddGift } from "./handlers/handleAddGift";
import { handleDeleteAdmin } from "./handlers/handleDeleteAdmin";

import WebApp from "@twa-dev/sdk";
import { GiftCard } from "@/components/ui/GiftCard";
import { DynamicModal } from "@/components/ui/Modal";
import type { Admin, Gift } from "@/types/types";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gifts");
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onclickItem = () => {
      navigate("/");
    };
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(onclickItem);

    return () => {
      WebApp.BackButton.offClick(onclickItem);
    };
  }, []);

  const { isOpen, modalData, openModal, closeModal } = useModal();
  const adminHandler = () => handleAddAdmin(openModal, setAdmins);
  const giftHandler = () => handleAddGift(openModal, setGifts);

  useAddButton(isOpen, activeTab, giftHandler, adminHandler);

  useAdminStatus(setIsAdmin, setIsSuperAdmin, setIsLoading);

  useLoadData(isAdmin || false, activeTab, setGifts, setAdmins);

  if (isLoading || !isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {isLoading
            ? "Loading..."
            : "Access denied. Admin privileges required."}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {isSuperAdmin && (
          <div className={styles.tabs}>
            <div
              className={`${styles.tab} ${
                activeTab === "gifts" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("gifts")}
            >
              Gifts
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "admins" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("admins")}
            >
              Admins
            </div>
          </div>
        )}
        <div className={styles.tabContent}>
          {(activeTab === "gifts" || !isSuperAdmin) && (
            <>
              <div className={styles.tabContentTitle}>Gifts</div>
              <div className={styles.giftsGrid}>
                {gifts &&
                  gifts.map((gift) => {
                    return (
                      <div key={gift.id} className={styles.giftCard}>
                        <GiftCard gift={gift} />
                      </div>
                    );
                  })}
              </div>
              {gifts.length === 0 && (
                <div className={styles.noGifts}>No gifts available</div>
              )}
            </>
          )}

          {activeTab === "admins" && isSuperAdmin && (
            <>
              <div className={styles.tabContentTitle}>Admins</div>

              {admins &&
                admins.map((admin) => {
                  return (
                    <div
                      key={admin.telegramID}
                      className={`${styles.adminCard} ${
                        admin.role === "SUPER_ADMIN" ? styles.superAdmin : ""
                      }`}
                    >
                      <div className={styles.adminCardInfo}>
                        <div className={styles.adminCardName}>{admin.name}</div>
                        <div className={styles.adminCardTelegramId}>
                          ID: {admin.telegramID}
                        </div>
                      </div>
                      {admin.role !== "SUPER_ADMIN" && isSuperAdmin && (
                        <div
                          className={styles.adminDeleteButton}
                          onClick={() =>
                            handleDeleteAdmin(admin.telegramID, setAdmins)
                          }
                        >
                          Delete
                        </div>
                      )}
                    </div>
                  );
                })}
              {admins.length === 0 && (
                <div className={styles.noAdmins}>No admins available</div>
              )}
            </>
          )}
          {isOpen && (
            <DynamicModal
              isOpen={isOpen}
              onClose={closeModal}
              {...modalData!}
            />
          )}
        </div>
      </div>
    </div>
  );
}
