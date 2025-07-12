export default function LoadingSpinner({ message }: { message: string }) {
    return (
        <div className="flex justify-center items-center p-8">
            <div className="text-lg">{message}</div>
        </div>
    );
}