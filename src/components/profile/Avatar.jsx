export default function Avatar({ person, size = 'md', selected = false }) {
  const sizes = {
    sm: 'h-10 w-10 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-24 w-24 text-2xl',
  };

  return (
    <div
      className={`${sizes[size]} shrink-0 overflow-hidden rounded-full border-2 ${
        selected ? 'border-emerald-500 ring-4 ring-emerald-100' : 'border-white'
      } bg-emerald-100 text-emerald-800 shadow-sm flex items-center justify-center font-extrabold`}
      aria-hidden="true"
    >
      {person.photo ? (
        <img className="h-full w-full object-cover" src={person.photo} alt="" />
      ) : (
        person.initials || person.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
      )}
    </div>
  );
}
