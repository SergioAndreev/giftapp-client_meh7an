import React, { useState } from "react";
import styles from "./styles.module.scss";
import constant from "@/constants";

/**
 * Represents a user's basic profile information
 * @interface User
 * @property {string | null} [username] - Optional Telegram username
 * @property {string} firstName - User's first name
 * @property {string} [lastName] - Optional last name
 */
interface User {
  username?: string | null;
  firstName: string;
  lastName?: string;
}

/**
 * A versatile avatar component that displays either a user's profile image or initials.
 * Falls back to initials if:
 * - Username is missing
 * - Profile image fails to load
 * - Profile image is invalid (1x1 pixel)
 *
 * @component
 * @param {Object} props - Component props
 * @param {User} props.user - User data object
 * @param {number} [props.size=2.5] - Avatar size in rem units
 *
 * @example
 * // With image
 * <Avatar user={{ username: "mehran", firstName: "Mehran", lastName: "Dev" }} size={3} />
 *
 * // With initials fallback
 * <Avatar user={{ firstName: "Mehran", lastName: "Dev" }} />
 */
const Avatar: React.FC<{
  user: User;
  size?: number | string;
  style?: React.CSSProperties;
}> = ({
  user,
  size = 2.5,
  style = {},
}: {
  user: User;
  size?: number | string;
  style?: React.CSSProperties;
}) => {
  const [invalidImage, setInvalidImage] = useState(false);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    // Check if image is 1x1 pixel (invalid avatar)
    if (img.naturalWidth <= 1 || img.naturalHeight <= 1) {
      setInvalidImage(true);
    }
  };

  const showPlaceholder = !user.username || invalidImage;

  return (
    <div
      className={styles.avatar}
      style={{
        width: typeof size === "number" ? `${size}rem` : size,
        height: typeof size === "number" ? `${size}rem` : size,
        ...style,
      }}
    >
      {!showPlaceholder && (
        <img
          src={`${constant.IMAGES_PREFIX}${user.username || 0}.jpg`}
          onLoad={handleImageLoad}
          onError={() => setInvalidImage(true)}
        />
      )}
      {showPlaceholder && (
        <div
          className={styles.avatarPlaceholder}
          style={{
            width: typeof size === "number" ? `${size}rem` : size,
            height: typeof size === "number" ? `${size}rem` : size,
            fontSize: `${Number(size) * 0.4}rem`,
            ...style,
          }}
        >
          {user.firstName.slice(0, 1)}
          {/* Zero-width non-joiner for better letter spacing */}
          {"\u200C"}
          {user.lastName?.slice(0, 1) || ""}
        </div>
      )}
    </div>
  );
};

export default Avatar;
