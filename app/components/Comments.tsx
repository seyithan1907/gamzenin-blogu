'use client';

import { useState } from "react";

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
  parentId?: string;
  replies?: Comment[];
}

export default function Comments({ postId }: { postId: string }) {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  // Yorumları localStorage'dan al
  const getComments = (): Comment[] => {
    const allComments = JSON.parse(localStorage.getItem("comments") || "{}");
    return allComments[postId] || [];
  };

  // Yeni yorum ekle
  const addComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: "Kullanıcı", // Gerçek kullanıcı adı buraya gelecek
      date: new Date().toISOString(),
      ...(replyTo && { parentId: replyTo }),
    };

    const allComments = JSON.parse(localStorage.getItem("comments") || "{}");
    const postComments = allComments[postId] || [];
    allComments[postId] = [...postComments, comment];
    localStorage.setItem("comments", JSON.stringify(allComments));

    setNewComment("");
    setReplyTo(null);
  };

  // Yorumları hiyerarşik yapıda düzenle
  const organizeComments = (postComments: Comment[]): Comment[] => {
    return postComments.reduce((acc: Comment[], comment: Comment) => {
      if (!comment.parentId) {
        // Ana yorum
        const replies = postComments.filter((c: Comment) => c.parentId === comment.id);
        return [...acc, { ...comment, replies }];
      }
      return acc;
    }, []);
  };

  const comments = organizeComments(getComments());

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Yorumlar</h3>
      
      {/* Yorum formu */}
      <form onSubmit={addComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyTo ? "Yanıtınızı yazın..." : "Yorumunuzu yazın..."}
          className="w-full p-2 border rounded"
          rows={3}
        />
        <div className="flex justify-between items-center mt-2">
          {replyTo && (
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-gray-500"
            >
              Yanıtlamayı İptal Et
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {replyTo ? "Yanıtla" : "Yorum Yap"}
          </button>
        </div>
      </form>

      {/* Yorumları listele */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex justify-between">
              <span className="font-bold">{comment.author}</span>
              <span className="text-gray-500">
                {new Date(comment.date).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2">{comment.text}</p>
            <button
              onClick={() => setReplyTo(comment.id)}
              className="text-blue-500 mt-2"
            >
              Yanıtla
            </button>

            {/* Yanıtları göster */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-8 mt-4 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="border-l-2 pl-4">
                    <div className="flex justify-between">
                      <span className="font-bold">{reply.author}</span>
                      <span className="text-gray-500">
                        {new Date(reply.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2">{reply.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 