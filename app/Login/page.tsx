import Link from "next/link";

const routes = [
  {
    id: "phone-number",
    name: "Login / PhoneNumber",
    description: "Phone number + OTP flow",
    path: "/Login/PhoneNumber",
  },
  {
    id: "user-password",
    name: "Login / UserPassword",
    description: "Username + password (login)",
    path: "/Login/UserPassword",
  },
  {
    id: "email-password",
    name: "Login / EmailPassword",
    description: "Email + password (login)",
    path: "/Login/EmailPassword",
  },
  {
    id: "user-signup",
    name: "Login / UserSignup",
    description: "Username + password (signup)",
    path: "/Login/UserSignup",
  },
  {
    id: "github",
    name: "Login / GitHub",
    description: "GitHub OAuth demo",
    path: "/Login/GitHub",
  },
] as const;

export default function LoginRedirectPage() {
  return (
    <main className="min-h-screen bg-[#0e0b0b] px-4 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-2xl bg-[#141416] p-6 sm:p-10">
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Login Examples
          </h1>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Pick a method to open its dedicated demo page.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {routes.map((route) => (
            <Link
              key={route.id}
              href={route.path}
              className="group relative overflow-hidden rounded-xl border border-cyan-400/20 bg-[#0a0a0a] p-5 transition-transform duration-300 hover:scale-[1.02] hover:border-cyan-300/60"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-[130%] bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent transition-transform duration-500 group-hover:translate-x-[130%]" />
              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-cyan-300">{route.name}</h2>
                <p className="mt-2 text-sm text-zinc-400">{route.description}</p>
           
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
