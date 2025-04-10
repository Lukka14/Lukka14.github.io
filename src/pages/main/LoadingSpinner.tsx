export const LoadingSpinner: React.FC = () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);