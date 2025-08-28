import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { AlbumForm } from "../albumForm/AlbumForm";
import style from "./albumsList.module.css";
import { ImagesList } from "../imagesList/ImagesList";

export const AlbumsList = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateAlbum, setIsCreateAlbum] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    getAllAlbums();
  }, []);

  //function to get all albums
  const getAllAlbums = () => {
    const q = query(collection(db, "albums"), orderBy("createdAt", "desc"));
    const snapshot = onSnapshot(q, (snapshot) => {
      setLoading(true);
      const albums = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlbums(albums);
      setLoading(false);
      console.log(albums);
    });
  };

  return (
    <div>
      {selectedAlbum ? (
        <ImagesList
          albums={albums}
          albumId={selectedAlbum.id}
          albumName={selectedAlbum.name}
          setSelectedAlbum={setSelectedAlbum}
        />
      ) : (
        <>
          {isCreateAlbum && <AlbumForm loading={loading} albums={albums} />}
          <div className={style.top}>
            <h3>Your albums</h3>
            <button
              onClick={() => setIsCreateAlbum(!isCreateAlbum)}
              className={isCreateAlbum ? style.active : ""}
            >
              {!isCreateAlbum ? "Add album" : "Cancel"}
            </button>
          </div>

          {albums && (
            <div className={style.albumsList}>
              {albums.map((album) => (
                <div
                  className={style.album}
                  onClick={() => setSelectedAlbum(album)}
                  key={album.id}
                >
                  <img src="https://photo-folio-cn.netlify.app/assets/photos.png"></img>
                  <span>{album.name}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
