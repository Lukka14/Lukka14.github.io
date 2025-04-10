import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../schemas";
import { z } from "zod";

type FormData = z.infer<typeof formSchema>;

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notifyNewReleases: false,
      notificationFrequency: "weekly"
    }
  });

  const onSubmit = async (data: FormData) => {
    // TODO
  };

  return (
    <div style={modalOverlayStyles}>
      <div style={modalStyles}>
        <h3 className="text-center mb-4">Notify Me About Movies</h3>
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>

          <div className="mb-3">
            <label htmlFor="movieName" className="form-label">
              Movie Name
            </label>
            <input
              type="text"
              className={`form-control ${errors.movieName ? "is-invalid" : ""}`}
              id="movieName"
              placeholder="Enter the movie name"
              {...register("movieName")}
            />
            {errors.movieName && (
              <div className="invalid-feedback">{errors.movieName.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Preferred Genre</label>
            <div>
              <div className="form-check">
                <input
                  className={`form-check-input ${errors.genre ? "is-invalid" : ""}`}
                  type="radio"
                  id="genreAction"
                  value="action"
                  {...register("genre")}
                />
                <label className="form-check-label" htmlFor="genreAction">
                  Action
                </label>
              </div>
              <div className="form-check">
                <input
                  className={`form-check-input ${errors.genre ? "is-invalid" : ""}`}
                  type="radio"
                  id="genreComedy"
                  value="comedy"
                  {...register("genre")}
                />
                <label className="form-check-label" htmlFor="genreComedy">
                  Comedy
                </label>
              </div>
              <div className="form-check">
                <input
                  className={`form-check-input ${errors.genre ? "is-invalid" : ""}`}
                  type="radio"
                  id="genreDrama"
                  value="drama"
                  {...register("genre")}
                />
                <label className="form-check-label" htmlFor="genreDrama">
                  Drama
                </label>
              </div>
              {errors.genre && (
                <div className="invalid-feedback d-block">{errors.genre.message}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="notifyNewReleases"
                {...register("notifyNewReleases")}
              />
              <label className="form-check-label" htmlFor="notifyNewReleases">
                Notify me about new releases
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="notificationFrequency" className="form-label">
              Notification Frequency
            </label>
            <select
              className={`form-select ${errors.notificationFrequency ? "is-invalid" : ""}`}
              id="notificationFrequency"
              {...register("notificationFrequency")}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {errors.notificationFrequency && (
              <div className="invalid-feedback">{errors.notificationFrequency.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="additionalNotes" className="form-label">
              Additional Notes
            </label>
            <textarea
              className={`form-control ${errors.additionalNotes ? "is-invalid" : ""}`}
              id="additionalNotes"
              rows={3}
              placeholder="Enter any additional preferences or notes"
              {...register("additionalNotes")}
            ></textarea>
            {errors.additionalNotes && (
              <div className="invalid-feedback">{errors.additionalNotes.message}</div>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <button onClick={onClose} className="btn btn-danger">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const modalOverlayStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyles: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "500px",
  textAlign: "left",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

export default Modal;