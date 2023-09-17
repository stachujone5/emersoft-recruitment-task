import { NextResponse } from "next/server";
import blogData from "../blog.json";

export function GET() {
	return NextResponse.json(blogData);
}
