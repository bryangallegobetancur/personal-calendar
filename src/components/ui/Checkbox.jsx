export function Checkbox({ id, label, checked, onChange, disabled }) {
  return (
    <label htmlFor={id} className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-800"
      />
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  )
}
