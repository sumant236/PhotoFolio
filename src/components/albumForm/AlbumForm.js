import { addDoc, collection } from "firebase/firestore";
import styles from "./albumForm.module.css";
import { useRef } from "react";
import { db } from "../../firebase";
import { toast } from "react-toastify";

export const AlbumForm = ({ loading, albums }) => {
  const albumNameInput = useRef();
  // function  to handle the clearing of the form
  const handleClear = () => {
    albumNameInput.current.value = null;
  };
  // function to handle the form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (albums.find((a) => a.name === albumNameInput.current.value)) {
      return toast.error("Album name already in use.");
    }

    try {
      const albumsRef = collection(db, "albums");
      const docRef = await addDoc(albumsRef, {
        name: albumNameInput.current.value,
        createdAt: new Date(),
      });

      albumNameInput.current.value = null;
      toast.success("Album created successfully");
    } catch (e) {
      toast.error("Error creating album");
    }
  };

  return (
    <div className={styles.albumForm}>
      <span>Create an album</span>
      <form onSubmit={handleSubmit}>
        <input required placeholder="Album Name" ref={albumNameInput} />
        <button type="button" onClick={handleClear} disabled={loading}>
          Clear
        </button>
        <button disabled={loading}>Create</button>
      </form>
    </div>
  );
};
