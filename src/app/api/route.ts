import { NextResponse } from "next/server";
import blogData from "../blog.json";

export function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const searchQuery = searchParams.get("search") ?? "";
	const categoriesQueries = searchParams
		.getAll("category")
		.map((category) => category.toLowerCase());

	const postsFilteredByName = blogData.posts.filter((post) =>
		post.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const postsFilteredByCategories =
		categoriesQueries.length === 0
			? postsFilteredByName
			: postsFilteredByName.filter((post) =>
					post.categories.some((categoryId) => {
						const categoryName = getCategoryNameById(categoryId);
						return categoriesQueries.includes(categoryName.toLowerCase());
					}),
			  );

	const filteredData = {
		categories: blogData.categories,
		posts: postsFilteredByCategories,
	};

	return NextResponse.json(filteredData);
}

function getCategoryNameById(categoryId: number) {
	const category = blogData.categories.find((c) => c.id === categoryId);
	return category ? category.name : "";
}
