type TestButtonProps = {
  label: string
  onClick?: () => void
}

export default function TestButton({ label, onClick }: TestButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      {label}
    </button>
  )
}
