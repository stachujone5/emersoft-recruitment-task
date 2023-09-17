import Image from "next/image";
import { z } from "zod";
import { FilterCategoryButton, SearchInput } from "@/app/category-filter";

export const metadata = {
	title: "Browse blog posts",
};

const apiResponseSchema = z.object({
	posts: z.array(
		z.object({
			id: z.number(),
			slug: z.string(),
			title: z.string(),
			excerpt: z.string(),
			imageUrl: z.string().url(),
			categories: z.array(z.number()),
		}),
	),
	categories: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			slug: z.string(),
		}),
	),
});

const mapParamsToArray = (params: string | string[] | undefined) => {
	return typeof params === "object" ? params : typeof params === "string" ? [params] : [];
};

const getBlogPosts = async (searchParams: Record<string, string | string[] | undefined>) => {
	const searchQuery = typeof searchParams?.search === "string" && searchParams.search;

	const categoriesQueries = mapParamsToArray(searchParams?.category);

	const params = new URLSearchParams();

	if (searchQuery) {
		params.append("search", searchQuery);
	}

	categoriesQueries.forEach((param) => params.append("category", param));

	const paramsString = params.toString().length > 0 ? `?${params.toString()}` : "";

	const res = await fetch(`http://localhost:3000/api${paramsString}`);

	const data = (await res.json()) as unknown;

	return apiResponseSchema.parse(data);
};

interface Props {
	searchParams: Record<string, string | string[] | undefined>;
}

export default async function Home({ searchParams }: Props) {
	const data = await getBlogPosts(searchParams);

	return (
		<main className="flex min-h-screen flex-col bg-slate-200 p-6 md:p-12 lg:p-24">
			<h1 className="mb-4 text-center text-3xl font-bold text-black">From the blog</h1>
			<h2 className="font-base mb-5 text-center text-base text-slate-900">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit tempore assumenda
				accusantium soluta ipsum veniam consequuntur harum. Quasi ex aliquid pariatur numquam, ut
				autem natus sint optio quia dolor saepe?
			</h2>
			<div className="mb-8 flex flex-wrap items-center justify-center gap-4">
				{data.categories.map((category) => (
					<FilterCategoryButton key={category.id}>{category.name}</FilterCategoryButton>
				))}
				<SearchInput />
			</div>
			{data.posts.length > 0 ? (
				<section className="grid flex-grow grid-cols-1 justify-center gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
					{data.posts.map((post) => (
						<div className="h-96 overflow-hidden rounded-md bg-white shadow-md" key={post.id}>
							<div className="relative h-1/2">
								<Image
									src={post.imageUrl}
									className="object-cover"
									fill
									alt={`Thumbnail of post: ${post.title}`}
								/>
							</div>

							<div className="h-1/2 p-4">
								<p className="mb-2 text-base font-medium text-blue-600">
									{post.categories
										.map((category) => data.categories.find((c) => c.id === category)?.name)
										.join(", ")}
								</p>
								<h3 className="mb-2 font-semibold">{post.title}</h3>
								<p className="text-xs">{post.excerpt}</p>
							</div>
						</div>
					))}
				</section>
			) : (
				<div className="flex flex-grow items-center justify-center">
					<p className="text-4xl font-semibold">No posts found!</p>
				</div>
			)}
		</main>
	);
}
