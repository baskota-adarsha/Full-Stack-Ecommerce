"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div
      data-no-layout
      className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-muted/20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-background/80 backdrop-blur-sm rounded-full border shadow-lg">
              <Search className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Content Card */}
        <Card className="border-0 shadow-xl bg-background/95 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Page Not Found
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-md mx-auto leading-relaxed">
                Sorry, we couldn't find the page you're looking for. It might
                have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-xs text-muted-foreground/60">
          Error Code: 404 • Page Not Found
        </div>
      </div>
    </div>
  );
}
