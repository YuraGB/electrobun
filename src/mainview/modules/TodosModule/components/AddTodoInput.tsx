import { useState } from "react";

export const AddTodoInput = ({ onAdd }: { onAdd: (title: string) => void }) => {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim() !== "") {
      onAdd(title);
      setTitle("");
    }
  };

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo"
        className="border p-2 flex-grow"
      />
      <button
        type="button"
        onClick={handleAdd}
        className="bg-blue-500 text-white p-2"
      >
        Add new todo
      </button>
    </div>
  );
};
