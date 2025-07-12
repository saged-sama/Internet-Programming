export default function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex justify-center items-center p-8">
            <div className="text-lg text-muted-foreground">{message}</div>
        </div>
    );
}