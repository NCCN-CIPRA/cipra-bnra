import { useRef, useEffect, useState } from "react";

const DEBOUNCE_SAVE_DELAY_MS = 10000;

export default function useAutosave<T extends { [key: string]: any }>({
  fields,
  compareTo,
  handleSave,
  enable,
}: {
  fields: Partial<T>;
  compareTo: Partial<T>;
  handleSave: (fieldsToSave: Partial<T>) => Promise<void>;
  enable: boolean;
}) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fieldsToUpdate, setFieldsToUpdate] = useState<Partial<T> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const newFieldsToUpdate = Object.keys(fields).filter((f) => compareTo[f] && fields[f] !== compareTo[f]);

    if (newFieldsToUpdate.length > 0) {
      const updatedFields = newFieldsToUpdate.reduce(
        (toUpdate, f) => ({
          ...toUpdate,
          [f]: fields[f],
        }),
        {}
      );

      // Check if we already found these fields in a previous update
      if (JSON.stringify(updatedFields) === JSON.stringify(fieldsToUpdate)) return;

      setFieldsToUpdate(updatedFields);
    } else if (fieldsToUpdate !== null) {
      setFieldsToUpdate(null);
    }
  }, [fields, compareTo, setFieldsToUpdate, fieldsToUpdate]);

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

  return { isSaving, fieldsToUpdate };
}
