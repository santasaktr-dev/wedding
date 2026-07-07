import { signInAdmin } from "../actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasInvalidLogin = params?.error === "invalid";

  return (
    <main className="min-h-screen bg-[#fbf8f0] px-5 py-10 text-[#0a1f44] sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <div className="w-full border border-[#d6c8a5] bg-[#fffdf7] p-7 shadow-[0_24px_70px_rgba(10,31,68,0.14)] sm:p-9">
          <p className="luxury-heading text-xs font-semibold text-[#7c5c3b]">Wedding CMS</p>
          <h1 className="mt-4 font-serif text-3xl font-medium text-[#0a1f44]">Admin Sign In</h1>
          <p className="mt-3 text-sm leading-6 text-[#3e4d3a]">
            Access the private editor for Jah & Smart wedding website content.
          </p>

          {hasInvalidLogin ? (
            <p className="mt-6 border border-[#7c5c3b]/30 bg-[#f7efe2] px-4 py-3 text-sm font-medium text-[#7c5c3b]">
              Invalid email or password. Please try again.
            </p>
          ) : null}

          <form action={signInAdmin} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0a1f44]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full border border-[#bdbfba] bg-white px-4 py-3 text-base text-[#0a1f44] outline-none transition focus:border-[#0a1f44] focus:ring-2 focus:ring-[#d6c8a5]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#0a1f44]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2 w-full border border-[#bdbfba] bg-white px-4 py-3 text-base text-[#0a1f44] outline-none transition focus:border-[#0a1f44] focus:ring-2 focus:ring-[#d6c8a5]"
              />
            </div>

            <button
              type="submit"
              className="w-full border border-[#0a1f44] bg-[#0a1f44] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#132c5b] focus:outline-none focus:ring-2 focus:ring-[#d6c8a5] focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
