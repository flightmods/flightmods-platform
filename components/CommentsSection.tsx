"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Comment = {
  id: number;
  addon_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
};

type UserLike = {
  id: string;
  email?: string;
};

export default function CommentsSection({ addonId }: { addonId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState<UserLike | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUser();
    loadComments();
  }, [addonId]);

  async function loadUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user ?? null);
  }

  async function loadComments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("addon_id", addonId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComments(data as Comment[]);
    }

    setLoading(false);
  }

  async function handleSubmitComment() {
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    if (!content.trim()) {
      alert("Please enter a comment.");
      return;
    }

    setSubmitting(true);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    const username = profileData?.username ?? user.email ?? "User";

    const { error } = await supabase.from("comments").insert([
      {
        addon_id: addonId,
        user_id: user.id,
        username,
        content: content.trim(),
      },
    ]);

    if (error) {
      alert(`Failed to post comment: ${error.message}`);
      setSubmitting(false);
      return;
    }

    setContent("");
    await loadComments();
    setSubmitting(false);
  }

  async function handleDeleteComment(commentId: number) {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      alert(`Failed to delete comment: ${error.message}`);
      return;
    }

    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
      <h2 className="mb-5 text-2xl font-bold">Comments</h2>

      {user ? (
        <div className="mb-8">
          <textarea
            className="mb-4 min-h-[120px] w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 outline-none placeholder:text-zinc-500 focus:border-blue-500"
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            onClick={handleSubmitComment}
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-black/20 p-4 text-sm text-zinc-400">
          Please log in to write a comment.
        </div>
      )}

      {loading ? (
        <p className="text-zinc-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-zinc-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-zinc-800 bg-black/20 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{comment.username}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>

                {user?.id === comment.user_id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-sm text-red-400 transition hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
              </div>

              <p className="whitespace-pre-line leading-7 text-zinc-300">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}