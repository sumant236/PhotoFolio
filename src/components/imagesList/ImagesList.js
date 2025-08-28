import styles from "./imageList.module.css";
import { useState, useRef, useEffect } from "react";
import Spinner from "react-spinner-material";
import { ImageForm } from "../imageForm/ImageForm";
import { Carousel } from "../carousel/Carousel";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
export const ImagesList = ({ albumId, albumName, setSelectedAlbum }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchIntent, setSearchIntent] = useState(false);
  const searchInput = useRef();

  const [addImageIntent, setAddImageIntent] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [updateImageIntent, setUpdateImageIntent] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [activeHoverImageIndex, setActiveHoverImageIndex] = useState(null);

  useEffect(() => {
    getImages();
  }, []);

  // async function to get all the images from the firebase
  const getImages = async () => {
    setLoading(true);
    const q = query(
      collection(db, "albums", albumId, "imageList"),
      orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const imageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imageList);
      setLoading(false);
      console.log(imageList);
    });
  };

  // function to handle toggle next image
  const handleNext = () => {
    setImgLoading(true);
    if (activeImageIndex >= images.length - 1) {
      setActiveImageIndex(0);
    } else {
      setActiveImageIndex(activeImageIndex + 1);
    }
    setImgLoading(false);
  };

  // function to handle toggle previous image
  const handlePrev = () => {
    setImgLoading(true);
    if (activeImageIndex === 0) {
      setActiveImageIndex(images.length - 1);
    } else {
      setActiveImageIndex(activeImageIndex - 1);
    }
    setImgLoading(false);
  };

  // function to handle cancel
  const handleCancel = () => {
    setActiveImageIndex(null);
  };

  // function to handle search functionality for image
  const handleSearchClick = () => {
    setSearchIntent(!searchIntent);
  };

  // function to handle search functionality for image
  const handleSearch = async () => {
    setLoading(true);
    const collectionRef = collection(db, "albums", albumId, "imageList");
    const q = query(
      collectionRef,
      where("title", ">=", searchInput.current.value),
      where("title", "<=", searchInput.current.value + "\uf8ff")
    );

    onSnapshot(q, (snapshot) => {
      const imageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imageList);
      setLoading(false);
    });
  };

  // async functions to add the image
  const handleAdd = async (title, url) => {
    try {
      await addDoc(collection(db, "albums", albumId, "imageList"), {
        title,
        url,
        createdAt: new Date(),
      });
      toast.success("Image added successfully");
    } catch (e) {
      toast.error("Error adding image");
    }
  };

  // function to handle update image
  const handleUpdate = async ({ title, url, id }) => {
    try {
      const imageRef = doc(db, "albums", albumId, "imageList", id);
      await updateDoc(imageRef, {
        title,
        url,
      });
      toast.success("Image updated successfully");
    } catch (e) {
      toast.error("Error updating image");
    }
  };

  // function to handle delete image
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      const imageRef = doc(db, "albums", albumId, "imageList", id);
      await deleteDoc(imageRef);
      toast.success("Image deleted successfully");
    } catch (e) {
      toast.error("Error adding image");
    }
  };

  if (!images.length && !searchInput.current?.value && !loading) {
    return (
      <>
        <div className={styles.top}>
          <span onClick={() => setSelectedAlbum(null)}>
            <img src="/assets/back.png" alt="back" />
          </span>
          <h3>No images found in the album.</h3>
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(!addImageIntent)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        </div>
        {addImageIntent && (
          <ImageForm
            loading={imgLoading}
            onAdd={handleAdd}
            albumName={albumName}
          />
        )}
      </>
    );
  }
  return (
    <>
      {(addImageIntent || updateImageIntent) && (
        <ImageForm
          loading={imgLoading}
          onAdd={handleAdd}
          albumName={albumName}
          onUpdate={handleUpdate}
          updateIntent={updateImageIntent}
        />
      )}
      {(activeImageIndex || activeImageIndex === 0) && (
        <Carousel
          title={images[activeImageIndex].title}
          url={images[activeImageIndex].url}
          onNext={handleNext}
          onPrev={handlePrev}
          onCancel={handleCancel}
        />
      )}
      <div className={styles.top}>
        <span onClick={onBack}>
          <img src="/assets/back.png" alt="back" />
        </span>
        <h3>Images in {albumName}</h3>

        <div className={styles.search}>
          {searchIntent && (
            <input
              placeholder="Search..."
              onChange={handleSearch}
              ref={searchInput}
              autoFocus={true}
            />
          )}
          <img
            onClick={handleSearchClick}
            src={!searchIntent ? "/assets/search.png" : "/assets/clear.png"}
            alt="clear"
          />
        </div>
        {updateImageIntent && (
          <button
            className={styles.active}
            onClick={() => setUpdateImageIntent(false)}
          >
            Cancel
          </button>
        )}
        {!updateImageIntent && (
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(!addImageIntent)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        )}
      </div>
      {loading && (
        <div className={styles.loader}>
          <Spinner color="#0077ff" />
        </div>
      )}
      {!loading && (
        <div className={styles.imageList}>
          {images.map((image, i) => (
            <div
              key={image.id}
              className={styles.image}
              onMouseOver={() => setActiveHoverImageIndex(i)}
              onMouseOut={() => setActiveHoverImageIndex(null)}
              onClick={() => setActiveImageIndex(i)}
            >
              <div
                className={`${styles.update} ${
                  activeHoverImageIndex === i && styles.active
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateImageIntent(image);
                }}
              >
                <img src="/assets/edit.png" alt="update" />
              </div>
              <div
                className={`${styles.delete} ${
                  activeHoverImageIndex === i && styles.active
                }`}
                onClick={(e) => handleDelete(e, image.id)}
              >
                <img src="/assets/trash-bin.png" alt="delete" />
              </div>
              <img
                src={image.url}
                alt={image.title}
                onError={({ currentTarget }) => {
                  currentTarget.src = "/assets/warning.png";
                }}
              />
              <span>{image.title.substring(0, 20)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
