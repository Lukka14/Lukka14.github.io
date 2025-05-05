import { Toast, ToastContainer } from 'react-bootstrap';

type CustomToast = {
    open: boolean;
    setOpen: (open: boolean) => void;
    text?: string;
    delay?: number;
    autohide?: boolean;
};

export function CustomToast({
    open,
    setOpen,
    text = 'Something went wrong! Try again later.',
    delay = 3000,
    autohide = true,
}: CustomToast) {
    return (
        <ToastContainer
            className="p-3"
            style={{
                position: 'fixed',
                bottom: 5,
                left: 5,
                zIndex: 1055,
            }}
        >
            <Toast
                show={open}
                onClose={() => setOpen(false)}
                delay={delay}
                autohide={autohide}
                style={{
                    backgroundColor: '#1c2231',
                    color: '#f5f5f5',
                    border: 'none',
                }}
            >
                <Toast.Body className="d-flex justify-content-between align-items-center">
                    <span>{text}</span>
                    <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        aria-label="Close"
                        onClick={() => setOpen(false)}
                    ></button>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}
