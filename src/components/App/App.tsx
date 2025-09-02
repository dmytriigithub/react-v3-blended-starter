import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";

import type { Photo } from "../../types/photo";
import toast, { Toaster } from "react-hot-toast";

import { getPhotos } from "../../services/photos";

import { useState } from "react";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleSearch = async (value: string) => {
    try {
      setPhotos([]);
      setIsLoading(true);
      setIsError(false);
      const data = await getPhotos(value);

      if (!data.length) {
        toast.error("No photos found for your request.");
        return;
      }
      setPhotos(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <Toaster />
      <Section>
        <Container>
          <Form onSubmit={handleSearch} />
          {isLoading && <Loader />}
          {isError && (
            <Text textAlign={"center"}>
              {"Whoops, something went wrong! Please try again!"}
            </Text>
          )}
          {photos.length > 0 && (
            <PhotosGallery photos={photos} onSelect={openModal} />
          )}
          {selectedPhoto && (
            <Modal onClose={closeModal} photo={selectedPhoto} />
          )}
        </Container>
      </Section>
    </>
  );
}
