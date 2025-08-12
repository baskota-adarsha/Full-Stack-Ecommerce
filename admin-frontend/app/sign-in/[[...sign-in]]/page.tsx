import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              footer: "hidden", // Hides "Secured by Clerk"
            },
          }}
        />
      </div>
    </div>
  );
}
