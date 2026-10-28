import type { Metadata } from "next";
import { PostForm } from "@/components/post/post-form";
import { Tag } from "@/components/ui/chip";

export const metadata: Metadata = {
  title: "Post surplus",
};

export default function PostPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Post surplus
          </h1>
          <p className="mt-1 text-sm text-muted">
            Tell the board what you have and when it was cooked. Eatsly sets the safe
            window, estimates the weight and names the NGO that can make it — you only
            press one button.
          </p>
        </div>
        <Tag>sample data</Tag>
      </div>

      <PostForm />
    </div>
  );
}
