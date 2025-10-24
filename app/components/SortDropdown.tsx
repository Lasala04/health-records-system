'use client';

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';

type SortDropdownProps = {
  onSortChange: (option: SortOption) => void;
  currentSort: SortOption;
};

export default function SortDropdown({ onSortChange, currentSort }: SortDropdownProps) {
  return (
    <select
      value={currentSort}
      onChange={(e) => onSortChange(e.target.value as SortOption)}
      className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="name-asc">Name (A-Z)</option>
      <option value="name-desc">Name (Z-A)</option>
      <option value="date-asc">Oldest First</option>
      <option value="date-desc">Newest First</option>
    </select>
  );
}