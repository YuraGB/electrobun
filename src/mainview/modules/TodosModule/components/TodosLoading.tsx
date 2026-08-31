export const TodosLoading = ({ isLoading }: { isLoading: boolean }) => {
	if (!isLoading) return null;
	return (
		<div role="status" className="max-w-sm animate-pulse">
			<div className="h-2 bg-neutral-quaternary rounded-full max-w-90 mb-2.5"></div>
			<span className="sr-only">Loading...</span>
		</div>
	);
};
