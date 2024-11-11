import { useState } from "react";
import WebApp from "@twa-dev/sdk";
import { transformFormData } from "../parts/formUtils";
import { TableData } from "../types/modal.types";

type FeedbackFunction = (
  data: Record<string, string | number>
) => Promise<{ error: string; success: boolean }>;

interface UseModalFormProps {
  table: TableData;
  onClose: () => void;
  feedback?: FeedbackFunction;
  refresher?: () => void;
}

export const useModalForm = ({
  table,
  onClose,
  feedback,
  refresher,
}: UseModalFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateInputs = () => {
    const requiredFields = Object.entries(table).filter(
      ([, value]) =>
        ["number", "string", "number+0"].includes(value) ||
        value.toString().startsWith("file:")
    );

    return requiredFields.every(
      ([key]) => formData[key] && formData[key].trim() !== ""
    );
  };

  const handleButtonClick = async () => {
    if (!feedback) {
      onClose();
      return;
    }

    if (!validateInputs()) {
      WebApp.showPopup({
        title: "Validation Error",
        message: "Please fill in all required fields",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { success, error } = await feedback(transformFormData(formData));

      if (!success) {
        WebApp.showPopup({
          title: "Error",
          message: error,
        });
        return;
      }

      if (refresher) refresher();
      onClose();
    } catch (error) {
      console.error(error);
      WebApp.showPopup({
        title: "Error",
        message: "An error occured. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleButtonClick,
  };
};
