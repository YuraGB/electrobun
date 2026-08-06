export const EditButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className="bg-yellow-500 text-white p-2"
		>
			Edit todo
		</button>
	);
};
