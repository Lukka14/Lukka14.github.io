export const LoadingSpinner = ({ initial = false, size }: {
    initial?: boolean;
    size?: number;
}) => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: size ? "3px" : "20px",
        width: '100%',
        ...(initial && {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            alignItems: 'center',
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        })
    }}>
        <div style={{
            border: `${size ? "6px" : "4px"} solid rgba(0, 0, 0, 0.1)`,
            borderTopColor: '#3498db',
            borderRadius: '50%',
            width: initial ? '60px' : size ? "64px" : "40px",
            height: initial ? '60px' : size ? "64px" : "40px",
            animation: 'spin 1s linear infinite'
        }} />
        <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
);