import { useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";

const deleteAccountSchema = z.object({
    confirmDelete: z.literal("DELETE")
});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

export default function DeleteAccountModal() {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<DeleteAccountFormData>({
        resolver: zodResolver(deleteAccountSchema),
        defaultValues: {
            confirmDelete: "" as any
        }
    });

    const onSubmit: SubmitHandler<DeleteAccountFormData> = (data) => {
        // TODO
        //console.log(data);

        reset();
        if (closeButtonRef.current) {
            closeButtonRef.current.click();
        }
    };

    return (
        <div className="modal fade" id="deleteAccountModal" tabIndex={-1} aria-labelledby="deleteAccountModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content" style={{
                    backgroundColor: "#1c2231"
                    // backgroundImage: "url(https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true)",
                    // backgroundSize: "cover"
                }}>
                    <ModalHeader title="Delete Account" />
                    <div className="modal-body">
                        <form id="deleteAccountForm" onSubmit={handleSubmit(onSubmit)}>
                            <p style={{
                                color: "#c2c2c2"
                            }}>To confirm account deletion, please type <strong>DELETE</strong> in the field below:</p>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    className={`form-control ${errors.confirmDelete ? 'is-invalid' : ''}`}
                                    id="confirmDelete"
                                    placeholder="Type DELETE to confirm"
                                    {...register("confirmDelete")}
                                />
                                {errors.confirmDelete && (
                                    <div className="invalid-feedback d-block">Please type DELETE to confirm account deletion</div>
                                )}
                            </div>
                        </form>
                    </div>
                    <ModalFooter
                        primaryBtnText="Delete My Account"
                        primaryBtnClass="btn-outline-danger"
                        onPrimaryClick={handleSubmit(onSubmit)}
                        closeButtonRef={closeButtonRef}
                    />
                </div>
            </div>
        </div>
    );
}
