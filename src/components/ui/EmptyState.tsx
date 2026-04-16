import { PackageOpen } from "lucide-react";
import Link from "next/link";

export function EmptyState({
  title = "No items found",
  description = "Try adjusting your filters or search criteria.",
  actionLabel,
  actionHref,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <PackageOpen className="h-16 w-16 text-gray-200 mb-4" />
      <h3 className="text-lg font-semibold text-dark-text mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-6 py-2.5 bg-chocolate text-white rounded-xl text-sm font-medium hover:bg-chocolate/90 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
