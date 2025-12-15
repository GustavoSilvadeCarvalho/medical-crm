import { handleSignOut } from '@/lib/actions/logout';

export function SignOutButton() {
    return (
        <form action={handleSignOut}>
            <button
                className="flex h-12 w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400 md:flex-none md:justify-start md:p-2 md:px-3"
            >
                <div className="hidden md:block">Sair</div>
            </button>
        </form>
    );
}