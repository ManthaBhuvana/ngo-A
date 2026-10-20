
"use client";

import { useEffect } from "react";

export default function OldBlogsPage() {
  useEffect(() => {
    window.location.replace("/ourwork/blogs");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      Redirecting to Blogs...
    </div>
  );
}

