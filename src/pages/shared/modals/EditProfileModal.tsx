import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";

const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username cannot exceed 50 characters"),
    email: z.string().email("Please enter a valid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;


export default function EditProfileModal() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: "",
            email: ""
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (data: ProfileFormData) => {
        //TODO
        // const formData = {
        //     ...data,
        //     profileImage
        // };

        // console.log(formData);
        reset();
        if (closeButtonRef.current) {
            closeButtonRef.current.click();
        }
    };

    return (
        <div className="modal fade" id="editProfileModal" tabIndex={-1} aria-labelledby="editProfileModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <ModalHeader title="Edit Profile" />
                    <div className="modal-body">
                        <form id="profileForm" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3 text-center">
                                <div className="profile-image-container mb-3">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Profile Preview"
                                            className="rounded-circle"
                                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div
                                            className="bg-secondary bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center"
                                            style={{ width: "120px", height: "120px", margin: "0 auto" }}
                                        >
                                            <i className="bi bi-person-fill fs-1 text-secondary"></i>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="profileImage" className="btn btn-outline-primary btn-sm">
                                        <i className="bi bi-upload me-1"></i>
                                        Change Profile Picture
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control d-none"
                                        id="profileImage"
                                        name="profileImage"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        id="username"
                                        placeholder="Username"
                                        {...register("username")}
                                    />
                                </div>
                                {errors.username && (
                                    <div className="invalid-feedback d-block">{errors.username.message}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    placeholder="name@example.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <div className="invalid-feedback d-block">{errors.email.message}</div>
                                )}
                            </div>
                        </form>
                    </div>
                    <ModalFooter
                        primaryBtnText="Save changes"
                        onPrimaryClick={handleSubmit(onSubmit)}
                        closeButtonRef={closeButtonRef}
                    />
                </div>
            </div>
        </div>
    );
}