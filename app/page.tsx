import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-16 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        persian-auth
      </h1>
      <p className="max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
        کامپوننت‌های احراز هویت فارسی برای React — شامل ورود با شماره تلفن، نام
        کاربری، ایمیل و گیت‌هاب.
      </p>
      <Link
        href="/Login"
        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        مشاهده‌ی دمو
      </Link>
    </main>
  );
}
