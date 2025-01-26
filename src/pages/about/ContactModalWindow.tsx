import React from "react";

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <div style={modalOverlayStyles}>
      <div style={modalStyles}>
        <h3 className="text-center mb-4">Notify Me About Movies</h3>
        <form>

          <div className="form-group mb-3">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="mariampsu9@gmail.com"
            />
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
              className="form-control"
              id="movieName"
              placeholder="Enter the movie name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Preferred Genre</label>
            <div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="genre"
                  id="genreAction"
                  value="action"
                />
                <label className="form-check-label" htmlFor="genreAction">
                  Action
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="genre"
                  id="genreComedy"
                  value="comedy"
                />
                <label className="form-check-label" htmlFor="genreComedy">
                  Comedy
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="genre"
                  id="genreDrama"
                  value="drama"
                />
                <label className="form-check-label" htmlFor="genreDrama">
                  Drama
                </label>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="notifyNewReleases"
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
            <select className="form-select" id="notificationFrequency">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="additionalNotes" className="form-label">
              Additional Notes
            </label>
            <textarea
              className="form-control"
              id="additionalNotes"
              rows={3}
              placeholder="Enter any additional preferences or notes"
            ></textarea>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary w-100">
              Save
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
