import React, { useState } from "react";
import type { BaseRecord, FieldConfig } from "../pages/admin/types.ts";
import BackButton from "../ui/BackButton.tsx";
import { BiImageAdd } from "react-icons/bi";

interface GenericFormProps<T extends BaseRecord> {
  readonly title: string;
  readonly fields: FieldConfig<T>[];
  readonly initial?: T;
  readonly defaultImage: string;
  readonly onSubmit: (data: Omit<T, "id">) => void;
  readonly onBack: () => void;
}

export default function GenericForm<T extends BaseRecord>({
  title,
  fields,
  initial,
  defaultImage,
  onSubmit,
  onBack,
}: GenericFormProps<T>) {
  // states
  const [formState, setFormState] = useState<Record<string, string>>(() => {
    const state: Record<string, string> = {};
    for (const field of fields) {
      const key = field.key as string;
      const initialValue = initial
        ? (initial as Record<string, unknown>)[key]
        : undefined;
      state[key] =
        initialValue !== undefined && initialValue !== null
          ? String(initialValue)
          : "";
    }
    return state;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isEditMode = !!initial;

  // check if any form value is changed
  function isFormChanged(): boolean {
    if (!initial) return true;

    for (const field of fields) {
      const key = field.key as string;

      const initialValue = initial[key as keyof T];
      const currentValue = formState[key] ?? "";

      if (field.type === "number") {
        if (Number(initialValue) !== Number(currentValue)) return true;
      } else {
        if (String(initialValue ?? "") !== String(currentValue)) return true;
      }
    }

    return false;
  }

  // validate logic
  function validateField<T extends BaseRecord>(
    field: FieldConfig<T>,
    value: string,
  ): string | undefined {
    const isRequired = field.required !== false;

    if (isRequired && value.trim() === "") {
      return `${field.label.replace(" :", "").replace(":", "").trim()} is required`;
    }

    if (field.type === "number" && value.trim() !== "") {
      const num = Number.parseFloat(value);
      if (Number.isNaN(num) || num <= 0) {
        return `${field.label.replace(" :", "").replace(":", "").trim()} must be greater than 0`;
      }
    }

    if (field.validate) {
      const customError = field.validate(value);
      if (customError) return customError;
    }

    return undefined;
  }

  function validateAll<T extends BaseRecord>(
    fields: FieldConfig<T>[],
    formState: Record<string, string>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const field of fields) {
      const key = field.key as string;
      const error = validateField(field, formState[key] ?? "");
      if (error) errors[key] = error;
    }
    return errors;
  }

  function handleBlur(field: FieldConfig<T>, value: string) {
    const key = field.key as string;
    setTouched((prev) => ({ ...prev, [key]: true }));
    const error = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[key] = error;
      else delete next[key];
      return next;
    });
  }

  function handleChange(field: FieldConfig<T>, value: string) {
    const key = field.key as string;
    setFormState((prev) => ({ ...prev, [key]: value }));

    if (touched[key] || submitAttempted) {
      const error = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) next[key] = error;
        else delete next[key];
        return next;
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitAttempted(true);

    const allErrors = validateAll(fields, formState);

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const allTouched: Record<string, boolean> = {};
      for (const field of fields) allTouched[field.key as string] = true;
      setTouched(allTouched);
      return;
    }

    if (isEditMode && !isFormChanged()) {
      return;
    }

    const result: Record<string, unknown> = {
      image: initial?.image ?? defaultImage,
    };

    for (const field of fields) {
      const key = field.key as string;
      const raw = formState[key] ?? "";
      result[key] = field.type === "number" ? Number.parseFloat(raw) || 0 : raw;
    }

    onSubmit(result as Omit<T, "id">);
  }

  function shouldShowError(key: string): boolean {
    return (touched[key] || submitAttempted) && !!errors[key];
  }

  // classes for inputs and labels
  function inputClass(key: string): string {
    const base =
      "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 transition";
    if (shouldShowError(key)) {
      return `${base} border-red-400 focus:ring-red-200 bg-red-50`;
    }
    return `${base} border-gray-200 focus:ring-orange-300`;
  }

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full bg-white px-8 pt-4 pb-8">
        {/* Title */}
        <h1 className="mb-6 text-xl font-bold text-gray-800">{title}</h1>

        <div className="flex flex-col gap-6 rounded-lg border border-gray-300 p-6">
          {/* Image upload area */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div className="self-start">
              <BackButton onClick={onBack} />
            </div>

            {initial?.image || defaultImage ? (
              <img
                src={initial?.image ?? defaultImage}
                alt="preview"
                className="h-40 w-40 rounded-xl object-cover"
              />
            ) : (
              // Fallback grey box with upload icon shown when no image exists yet
              <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-gray-100">
                <BiImageAdd size={50} className="text-gray-400" />
              </div>
            )}
            <span className="text-xl font-semibold text-black">
              Upload Image
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {fields.map((field) => {
                const key = field.key as string;
                const isRequired = field.required !== false;

                return (
                  <div key={key}>
                    <label htmlFor={field.label} className={labelClass}>
                      {field.label}
                      {isRequired && (
                        <span className="ml-1 text-red-400">*</span>
                      )}
                    </label>

                    {field.type === "select" ? (
                      <select
                        className={inputClass(key)}
                        id={field.label}
                        value={formState[key] ?? ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                        onBlur={(e) => handleBlur(field, e.target.value)}
                      >
                        <option value="" disabled>
                          {field.placeholder}
                        </option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className={inputClass(key)}
                        placeholder={field.placeholder}
                        type={field.type}
                        id={field.label}
                        min={field.type === "number" ? "0" : undefined}
                        step={field.type === "number" ? "any" : undefined}
                        value={formState[key] ?? ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                        onBlur={(e) => handleBlur(field, e.target.value)}
                      />
                    )}

                    {shouldShowError(key) && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                        {/* Small warning icon */}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className="shrink-0"
                        >
                          <circle cx="6" cy="6" r="5.5" stroke="#EF4444" />
                          <path
                            d="M6 3.5V6.5"
                            stroke="#EF4444"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                          <circle cx="6" cy="8.5" r="0.6" fill="#EF4444" />
                        </svg>
                        {errors[key]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {submitAttempted && Object.keys(errors).length > 0 && (
              <p className="mb-4 text-center text-sm text-red-500">
                Please fix{" "}
                <span className="font-semibold">
                  {Object.keys(errors).length} error
                  {Object.keys(errors).length > 1 ? "s" : ""}
                </span>{" "}
                before saving.
              </p>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isEditMode && !isFormChanged()}
                className={`${
                  isEditMode && !isFormChanged()
                    ? "cursor-not-allowed bg-light-orange"
                    : "bg-orange hover:bg-dark-orange active:scale-95 cursor-pointer"
                } rounded-lg px-10 py-3 text-sm font-semibold text-white shadow-md transition-all duration-150`}
              >
                Save {title.replace("Add ", "").replace("Edit ", "")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
