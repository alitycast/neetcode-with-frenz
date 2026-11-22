interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  focusParticipantName: string | null
  hideCompleted: boolean
  onToggleHideCompleted: () => void
}

export const ALL_CATEGORIES = 'All categories'

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  focusParticipantName,
  hideCompleted,
  onToggleHideCompleted,
}: CategoryFilterProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <select
        value={selectedCategory}
        onChange={(event) => onSelectCategory(event.target.value)}
        className="font-display rounded-full border border-white/10 bg-night-card px-3 py-1.5 text-sm text-slate-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender/60"
      >
        <option value={ALL_CATEGORIES}>{ALL_CATEGORIES}</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {focusParticipantName && (
        <button
          type="button"
          onClick={onToggleHideCompleted}
          aria-pressed={hideCompleted}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            hideCompleted
              ? 'border-mint/40 bg-mint/15 text-mint'
              : 'border-white/10 bg-night-card text-slate-300 hover:border-mint/30 hover:text-mint'
          }`}
        >
          🙈 Hide {focusParticipantName}'s solved
        </button>
      )}
    </div>
  )
}
