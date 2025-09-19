import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

import css from "./EditPostForm.module.css";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../services/postService";
import toast from "react-hot-toast";
import { Post } from "../../types/post";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title too short")
    .max(50, "Title too long")
    .required("Title is required"),
  body: Yup.string().max(500, "Body too long").required("Body is required"),
});

interface EditPostFormProps {
  onClose: () => void;
  post: Post;
}

export default function EditPostForm({ onClose, post }: EditPostFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const mutationEdit = useMutation({
    mutationFn: (post: Post) => editPost(post),
    onSuccess: () => {
      toast.success("Post edited successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
    onError: () => toast.error("Failed to edit note."),
  });

  const handleSubmit = (values: Post, actions: FormikHelpers<Post>) => {
    mutationEdit.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={post}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      enableReinitialize
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
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutationEdit.isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
