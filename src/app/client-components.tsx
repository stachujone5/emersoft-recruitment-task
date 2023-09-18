"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { twMerge } from "tailwind-merge";
import { BiSearchAlt2 } from "react-icons/bi";

interface FilterCategoryButtonProps {
	children: string;
}

export const FilterCategoryButton = ({ children }: FilterCategoryButtonProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [, startTransition] = useTransition();

	const handleClick = () => {
		const params = new URLSearchParams(searchParams);
		const categoriesInParams = params.getAll("category");

		if (categoriesInParams.includes(children)) {
			params.delete("category");

			categoriesInParams.filter((c) => c !== children).forEach((c) => params.append("category", c));
		} else {
			params.append("category", children);
		}
		startTransition(() => {
			router.replace(`${pathname}?${params.toString()}`);
		});
	};

	return (
		<button
			onClick={handleClick}
			className={twMerge(
				"rounded-md bg-slate-50 px-4 py-2 shadow-sm transition-colors",
				searchParams.getAll("category").includes(children) && "bg-slate-300",
			)}
		>
			{children}
		</button>
	);
};

export const SearchInput = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [, startTransition] = useTransition();
	const searchParams = useSearchParams();

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newParams = new URLSearchParams(searchParams);

		if (e.target.value) {
			newParams.set("search", e.target.value);
		} else {
			newParams.delete("search");
		}

		startTransition(() => {
			router.replace(`${pathname}?${newParams.toString()}`);
		});
	};

	return (
		<>
			<label className="sr-only" htmlFor="searchBlogPosts">
				Search blog posts
			</label>
			<div className="flex items-center overflow-hidden rounded-md border bg-slate-50">
				<input
					className="px-4 py-2"
					type="search"
					placeholder="Search"
					defaultValue={searchParams.get("search") ?? ""}
					onChange={handleSearch}
					name="Search blog posts"
				/>
				<BiSearchAlt2 className="text-gray mr-2 text-2xl" />
			</div>
		</>
	);
};

interface PaginationProps {
	currentPage: number;
	totalPages: number;
}

export const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [, startTransition] = useTransition();

	const handlePreviousPage = () => {
		if (currentPage === 1) return;

		const params = new URLSearchParams(searchParams);

		params.set("page", (currentPage - 1).toString());

		startTransition(() => {
			router.replace(`${pathname}?${params.toString()}`);
		});
	};

	const handleNextPage = () => {
		console.log(currentPage);
		console.log(totalPages);
		if (currentPage === totalPages) return;

		const params = new URLSearchParams(searchParams);

		params.set("page", (currentPage + 1).toString());

		startTransition(() => {
			router.replace(`${pathname}?${params.toString()}`);
		});
	};

	return (
		<div className="mt-4 flex flex-col items-center justify-center">
			<p className="mb-1 text-center text-xs font-medium">
				Page: {currentPage} of total {totalPages}
			</p>
			<div className="flex gap-2">
				<button
					onClick={handlePreviousPage}
					disabled={currentPage === 1}
					className="rounded-md bg-slate-50 px-4 py-2 shadow-sm transition-colors disabled:cursor-not-allowed"
				>
					prev
				</button>
				<button
					onClick={handleNextPage}
					disabled={currentPage === totalPages}
					className="rounded-md bg-slate-50 px-4 py-2 shadow-sm transition-colors disabled:cursor-not-allowed"
				>
					next
				</button>
			</div>
		</div>
	);
};
