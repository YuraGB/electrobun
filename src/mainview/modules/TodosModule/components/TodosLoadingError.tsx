export const TodosLoadingError = ({ error }: { error: string }) => {
	if (!error) return null;
	return (
		<p className="bg-destructive/90 text-lg text-destructives">
			Error loading todos
		</p>
	);
};
