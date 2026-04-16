import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Container } from "@/components/layout/Container";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="bg-light-gray/50 border-b border-gray-100">
      <Container className="py-3">
        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            href="/"
            className="text-gray-400 hover:text-candy transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-gray-300" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-candy transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-dark-text font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </Container>
    </div>
  );
}
