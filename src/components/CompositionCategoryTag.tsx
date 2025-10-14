import type { Category } from "@/App";

export default function CompositionCategoryTab({
  category,
  handleClick,
  className,
}: {
  category: Category;
  handleClick: () => void;
  className?: string;
}) {
  return (
    <button onClick={handleClick} className={className}>
      {category}
    </button>
  );
}
