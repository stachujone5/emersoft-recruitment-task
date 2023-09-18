import { NextResponse } from "next/server";
import blogData from "../blog.json";

export function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const searchQuery = searchParams.get("search") ?? "";
	const pageQuery = searchParams.get("page") ?? "1";
	const categoriesQueries = searchParams
		.getAll("category")
		.map((category) => category.toLowerCase());

	const take = 4;

	const pageNumber = Number.parseInt(pageQuery) || 1;
	const startIndex = (pageNumber - 1) * take;
	const endIndex = startIndex + take;

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

	const totalPages = Math.ceil(postsFilteredByCategories.length / take);
	const paginatedPosts = postsFilteredByCategories.slice(startIndex, endIndex);

	const filteredData = {
		categories: blogData.categories,
		posts: paginatedPosts,
		pagination: {
			totalPages,
			currentPage: pageNumber,
		},
	};

	return NextResponse.json(filteredData);
}

function getCategoryNameById(categoryId: number) {
	const category = blogData.categories.find((c) => c.id === categoryId);
	return category ? category.name : "";
}
