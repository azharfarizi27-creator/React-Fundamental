function StatCard({
  title,
  value,
  description,
  icon,
  iconStyle,
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md

        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-none
        dark:hover:border-slate-700
        dark:hover:shadow-lg
        dark:hover:shadow-black/20
      "
    >

      <div className="flex items-start justify-between">

        {/* ================================= */}
        {/* INFORMATION */}
        {/* ================================= */}

        <div className="min-w-0">

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {description}
          </p>

        </div>


        {/* ================================= */}
        {/* ICON */}
        {/* ================================= */}

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            transition-transform
            duration-300
            group-hover:scale-105

            ${iconStyle}
          `}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;