"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  LayoutDashboard,
  Tags,
  BarChart3,
  Settings,
  Archive,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    icon: Package,
    children: [
      { name: "All Products", href: "/" },
      { name: "Add Product", href: "/products/new" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>(["Products"]);

  const toggleItem = (name: string) => {
    setOpenItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Package className="h-8 w-8 text-primary" />
        <span className="ml-2 text-lg font-semibold">Admin Panel</span>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b">
        <Button asChild className="w-full">
          <Link href="/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <Collapsible
                open={openItems.includes(item.name)}
                onOpenChange={() => toggleItem(item.name)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between font-normal"
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </div>
                    {openItems.includes(item.name) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 ml-7 mt-1">
                  {item.children.map((child) => (
                    <Button
                      key={child.name}
                      variant="ghost"
                      size="sm"
                      asChild
                      className={cn(
                        "w-full justify-start font-normal",
                        pathname === child.href &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <Link href={child.href}>
                        {child.name}
                        {child.name === "Deleted Products" && (
                          <Badge variant="secondary" className="ml-auto">
                            12
                          </Badge>
                        )}
                      </Link>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Button
                variant="ghost"
                asChild
                className={cn(
                  "w-full justify-start font-normal",
                  pathname === item.href && "bg-accent text-accent-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              </Button>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
    </div>
  );
}
