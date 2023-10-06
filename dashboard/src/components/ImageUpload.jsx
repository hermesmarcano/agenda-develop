import { FaCloudUploadAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ImageUpload = ({ field, form, ...props }) => {
  const { t } = useTranslation();
  const handleChange = (event) => {
    const file = event.currentTarget.files[0];
    form.setFieldValue(field.name, file);
  };

  const hasError = form.touched[field.name] && form.errors[field.name];
  const value = field.value || form.values[field.name];

  return (
    <div className="mt-2">
      <input
        id={field.name}
        name={field.name}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        {...props}
      />
      <label htmlFor={field.name}>
        <div className="h-40 w-full rounded-md border-dashed border-2 border-gray-300 flex flex-col justify-center items-center">
          {value ? (
            <img
              src={URL.createObjectURL(value)}
              alt={`Uploaded ${field.name}`}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="text-center">
              <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">
                {t('Click or drag a file to upload')}
              </p>
            </div>
          )}
        </div>
      </label>
      {hasError && (
        <div className="mt-2 text-sm text-red-500">
          {form.errors[field.name]}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
