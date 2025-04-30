import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";

const movieNotificationSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    movieName: z.string().min(1, "Movie name is required"),
    genre: z.enum(["action", "comedy", "drama"]),
    notifyNewReleases: z.boolean(),
    notificationFrequency: z.enum(["daily", "weekly", "monthly"]),
    additionalNotes: z.string().optional(),
});

type MovieNotificationFormData = z.infer<typeof movieNotificationSchema>;

export default function ContactModalWindow() {
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<MovieNotificationFormData>({
        defaultValues: {
            email: "",
            movieName: "",
            genre: "action",
            notifyNewReleases: false,
            notificationFrequency: "weekly",
            additionalNotes: ""
        }
    });

    const onSubmit = async (data: MovieNotificationFormData) => {
        setLoading(true);
        setErrorMessage("");

        try {
            // TODO ||||| just for demonstration purposes currently this does nothing
            console.log(data);

            await new Promise(resolve => setTimeout(resolve, 1000));

            reset();

            if (closeButtonRef.current) {
                closeButtonRef.current.click();
            }
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message || "Submission failed. Please try again."
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>
                {styles}
            </style>
            <div className="modal fade" id="contactModalWindow" tabIndex={-1} aria-labelledby="contactModalWindowLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <ModalHeader title="Notify Me About Movies" />
                        <div className="modal-body">
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <form id="notificationForm" onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        placeholder="Enter your email"
                                        autoComplete="off"
                                        {...register("email")}
                                        disabled={loading}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback d-block">{errors.email.message}</div>
                                    )}
                                    <small id="emailHelp" className="form-text text-muted">
                                        We'll never share your email with anyone else.
                                    </small>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="movieName" className="form-label">Movie Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.movieName ? 'is-invalid' : ''}`}
                                        id="movieName"
                                        placeholder="Enter the movie name"
                                        autoComplete="off"
                                        {...register("movieName")}
                                        disabled={loading}
                                    />
                                    {errors.movieName && (
                                        <div className="invalid-feedback d-block">{errors.movieName.message}</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Preferred Genre</label>
                                    <div>
                                        <div className="form-check">
                                            <input
                                                {...register("genre")}
                                                className="form-check-input"
                                                type="radio"
                                                id="genreAction"
                                                value="action"
                                                disabled={loading}
                                            />
                                            <label className="form-check-label" htmlFor="genreAction">
                                                Action
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                {...register("genre")}
                                                className="form-check-input"
                                                type="radio"
                                                id="genreComedy"
                                                value="comedy"
                                                disabled={loading}
                                            />
                                            <label className="form-check-label" htmlFor="genreComedy">
                                                Comedy
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                {...register("genre")}
                                                className="form-check-input"
                                                type="radio"
                                                id="genreDrama"
                                                value="drama"
                                                disabled={loading}
                                            />
                                            <label className="form-check-label" htmlFor="genreDrama">
                                                Drama
                                            </label>
                                        </div>
                                    </div>
                                    {errors.genre && (
                                        <div className="invalid-feedback d-block">{errors.genre.message}</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <div className="form-check">
                                        <input
                                            {...register("notifyNewReleases")}
                                            className="form-check-input"
                                            type="checkbox"
                                            id="notifyNewReleases"
                                            disabled={loading}
                                        />
                                        <label className="form-check-label" htmlFor="notifyNewReleases">
                                            Notify me about new releases
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="notificationFrequency" className="form-label">
                                        Notification Frequency
                                    </label>
                                    <select
                                        {...register("notificationFrequency")}
                                        className="form-select"
                                        id="notificationFrequency"
                                        disabled={loading}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="additionalNotes" className="form-label">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        {...register("additionalNotes")}
                                        className="form-control"
                                        id="additionalNotes"
                                        rows={3}
                                        placeholder="Enter any additional preferences or notes"
                                        disabled={loading}
                                    ></textarea>
                                </div>

                                <button type="submit" style={{ display: "none" }}></button>
                            </form>
                        </div>
                        <ModalFooter
                            loading={loading}
                            onPrimaryClick={handleSubmit(onSubmit)}
                            closeButtonRef={closeButtonRef}
                            primaryBtnText="Notify"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

const styles = `
.modal-content {
    background-color: #1c2231 !important;
}
    .form-check-label { 
        color: #f5f5f5 !important;
    }
`