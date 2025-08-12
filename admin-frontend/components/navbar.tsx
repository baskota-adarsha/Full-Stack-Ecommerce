import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { setTheme, theme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-accent/50 transition-colors duration-200"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:bg-accent/50 transition-all duration-200 hover:scale-105"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-accent/50 transition-all duration-200 hover:scale-105 ring-2 ring-transparent hover:ring-accent/20"
              >
                <Avatar className="h-8 w-8 ring-2 ring-background shadow-md">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.fullName || "User avatar"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                    {user?.username || "U"}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 p-3 shadow-xl border border-border/50 bg-background/95 backdrop-blur-xl"
              align="end"
              forceMount
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-normal p-4 bg-gradient-to-r from-accent/30 to-accent/10 rounded-lg mb-3">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-14 w-14 ring-2 ring-background shadow-lg">
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={user?.fullName || "User avatar"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                      {user?.username || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-none truncate">
                      {user?.username || "User"}
                    </p>

                    {/* {user?.publicMetadata?.plan && (
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {user.publicMetadata.plan} Plan
                      </Badge> */}
                    {/* )} */}
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-2 bg-border/50" />

              <DropdownMenuSeparator className="my-2 bg-border/50" />

              <DropdownMenuItem
                className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200 rounded-md p-3 focus:bg-red-50 dark:focus:bg-red-950/20 group"
                onClick={() => signOut()}
              >
                <LogOut className="mr-3 h-4 w-4 text-red-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-red-600">Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
