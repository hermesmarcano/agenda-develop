import { FaSpinner } from 'react-icons/fa';
import { AiOutlineFileAdd } from 'react-icons/ai';

const LoadingSaveButton = ({ onClick, disabled, isSaving }) => {
    return (
      <button
        className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-blue-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-blue-500"
        onClick={onClick}
        disabled={disabled}
        type="submit"
      >
        {isSaving ? (
          <span className="flex items-center justify-center">
            <FaSpinner className="animate-spin mr-2" />
            Saving...
          </span>
        ) : (
          <>
            <span className="absolute -end-full transition-all group-hover:end-4">
              <AiOutlineFileAdd />
            </span>
            <span className="pr-2">Save</span>
          </>
        )}
      </button>
    );
  };


  export { LoadingSaveButton } 