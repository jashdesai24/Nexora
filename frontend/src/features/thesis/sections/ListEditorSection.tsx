import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "../../../components/ui";

interface ListEditorSectionProps {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  promptText?: string;
  placeholder?: string;
}

function ListEditorSection({
  title,
  items,
  onChange,
  promptText,
  placeholder = "Add a new item...",
}: ListEditorSectionProps) {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  return (
    <section>
      <h3 className="text-sm font-medium uppercase tracking-widest text-[var(--color-muted)]">
        {title}
      </h3>
      {promptText && (
        <p className="mt-2 text-base text-[var(--color-body)]">{promptText}</p>
      )}

      <ul className="mt-6 space-y-4">
        {items.map((item, index) => (
          <li key={index} className="group flex items-start gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text)]" />
            <textarea
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="w-full resize-none overflow-hidden bg-transparent text-lg leading-relaxed text-[var(--color-text)] placeholder-[var(--color-border-strong)] focus:outline-none"
              rows={Math.max(1, Math.ceil(item.length / 80))}
            />
            <button
              onClick={() => handleRemove(index)}
              className="mt-1 text-[var(--color-muted)] opacity-0 transition-opacity hover:text-[var(--color-text)] focus:opacity-100 group-hover:opacity-100"
              aria-label="Remove item"
            >
              <X className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-start gap-3">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]" />
        <div className="flex w-full flex-col items-start gap-3 sm:flex-row">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-lg leading-relaxed text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none"
          />
          <Button
            variant="ghost"
            className="shrink-0 text-xs uppercase tracking-widest"
            onClick={handleAdd}
            disabled={!newItem.trim()}
          >
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ListEditorSection;
