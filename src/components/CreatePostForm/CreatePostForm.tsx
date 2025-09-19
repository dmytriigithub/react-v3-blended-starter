import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from "formik";

import css from "./CreatePostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";
import toast from "react-hot-toast";
import { useId } from "react";

interface PostFormProps {
  onClose: () => void;
}

interface PostFormValues {
  title: string;
  body: string;
}

const initialValues: PostFormValues = {
  title: "",
  body: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title too short")
    .max(50, "Title too long")
    .required("Title is required"),
  body: Yup.string().max(500, "Body too long").required("Body is required"),
});

export default function PostForm({ onClose }: PostFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const mutationCreate = useMutation({
    mutationFn: (post: PostFormValues) => createPost(post),
    onSuccess: () => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
    onError: () => toast.error("Failed to create post."),
  });
  const handleSubmit = (values: PostFormValues, actions: FormikHelpers<PostFormValues>) => {
    mutationCreate.mutate(values);
    actions.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-body`}>Content</label>
          <Field
            id={`${fieldId}-body`}
            as="textarea"
            name="body"
            rows="8"
            className={css.textarea}
          />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutationCreate.isPending}>
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
