import styles from "./imageForm.module.css";
import { useEffect, useRef } from "react";

export const ImageForm = ({
  loading,
  onAdd,
  albumName,
  onUpdate,
  updateIntent,
}) => {
  const imageTitleInput = useRef();
  const imageUrlInput = useRef();

  useEffect(() => {
    handleDefaultValues();
  }, [updateIntent]);

  // function to handle image form submit
  const handleSubmit = (e, id) => {
    e.preventDefault();
    if (updateIntent) {
      console.log("inside imageForm");
      updateIntent.title = imageTitleInput.current.value;
      updateIntent.url = imageUrlInput.current.value;
      onUpdate(updateIntent);
      imageTitleInput.current.value = null;
      imageUrlInput.current.value = null;
    } else {
      onAdd(imageTitleInput.current.value, imageUrlInput.current.value);
    }
  };
  // function to thandle clearing the form
  const handleClear = () => {
    imageTitleInput.current.value = null;
    imageUrlInput.current.value = null;
  };
  // function to prefill the value of the form input
  const handleDefaultValues = () => {
    if (updateIntent) {
      imageTitleInput.current.value = updateIntent.title;
      imageUrlInput.current.value = updateIntent.url;
    }
  };

  return (
    <div className={styles.imageForm}>
      <span>
        {!updateIntent
          ? `Add image to ${albumName}`
          : `Update image ${updateIntent.title}`}
      </span>

      <form onSubmit={handleSubmit}>
        <input required placeholder="Title" ref={imageTitleInput} />
        <input required placeholder="Image URL" ref={imageUrlInput} />
        <div className={styles.actions}>
          <button type="button" onClick={handleClear} disabled={loading}>
            Clear
          </button>
          <button disabled={loading}>{updateIntent ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
};
