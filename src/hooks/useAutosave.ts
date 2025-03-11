import { useCallback, useRef, useEffect, useState } from "react";

const DEBOUNCE_SAVE_DELAY_MS = 10000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useAutosave<T extends { [key: string]: any }>({
  getFields,
  compareTo,
  handleSave,
  enable,
}: {
  getFields: () => Partial<T>;
  compareTo: Partial<T>;
  handleSave: (fieldsToSave: Partial<T>) => Promise<void>;
  enable: boolean;
}) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fieldsToUpdate, setFieldsToUpdate] = useState<Partial<T> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const getUpdatedFields = useCallback(() => {
    const fields = getFields();

    const newFieldsToUpdate = Object.keys(fields).filter(
      (f) => compareTo[f] && fields[f] !== compareTo[f]
    );

    if (newFieldsToUpdate.length > 0) {
      const updatedFields = newFieldsToUpdate.reduce(
        (toUpdate, f) => ({
          ...toUpdate,
          [f]: fields[f],
        }),
        {}
      );

      // Check if we already found these fields in a previous update
      if (JSON.stringify(updatedFields) === JSON.stringify(fieldsToUpdate))
        return;

      return updatedFields;
    } else if (fieldsToUpdate !== null) {
      return null;
    }
  }, [getFields, compareTo, fieldsToUpdate]);

  const forceUpdate = async () => {
    const updatedFields = getUpdatedFields();

    if (updatedFields != null) {
      setFieldsToUpdate(updatedFields);

      setIsSaving(true);

      await handleSave(updatedFields);

      setIsSaving(false);
    }
  };

  useEffect(() => {
    const updatedFields = getUpdatedFields();

    if (updatedFields !== undefined) setFieldsToUpdate(updatedFields);
  }, [setFieldsToUpdate, getUpdatedFields]);

  useEffect(() => {
    if (enable) {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }

      if (fieldsToUpdate !== null) {
        saveTimer.current = setTimeout(async () => {
          setIsSaving(true);

          await handleSave(fieldsToUpdate);

          setIsSaving(false);
        }, DEBOUNCE_SAVE_DELAY_MS);
      }
    }

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [enable, fieldsToUpdate, handleSave]);

  return { isSaving, fieldsToUpdate, forceUpdate };
}
