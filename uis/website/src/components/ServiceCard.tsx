export interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export default function ServiceCard({
  icon,
  title,
  description,
  features,
}: ServiceCardProps) {
  return (
    <div className="group p-8 bg-white rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center text-2xl mb-5 group-hover:bg-primary-100 transition-colors">
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-heading text-xl font-bold text-neutral-900 mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-neutral-600 leading-relaxed mb-5">{description}</p>

      {/* Features list */}
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-neutral-700">
            <svg
              className="w-4 h-4 text-accent-500 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
