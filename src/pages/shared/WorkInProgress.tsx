export const WorkInProgress = ({
    text,
    subtext
}: {
    text?: string;
    subtext?: string;
}) => {
    const isDefault = !text && !subtext;

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "180px",
                border: "1px dashed rgba(255,255,255,0.2)",
                borderRadius: "8px"
            }}
        >
            <div className="text-center">
                {isDefault && (
                    <>
                        <h4 className="text-white mb-2">Work in Progress</h4>
                    </>
                )}
                {!isDefault && (
                    <>
                        <h4 className="text-white mb-2">{text}</h4>
                        {subtext && (
                            <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
                                {subtext}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
