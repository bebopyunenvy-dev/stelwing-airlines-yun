"use client";

import { useRouter } from "next/navigation";
import { PenSquare } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";
import { useToast } from "@/app/context/toast-context";

export default function FloatingWriteButton() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const handleClick = () => {
    if (isLoggedIn) {
      router.push("/travel-community/write");
      return;
    }

    showToast({
      type: "info",
      title: "請先登入",
      message: "登入後即可撰寫旅遊分享。",
    });
    router.push("/member-center/login");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed right-5 bottom-5 lg:right-10 lg:bottom-10 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sw-accent)] text-white shadow-[0_15px_35px_rgba(31,46,60,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(31,46,60,0.25)]"
      aria-label="撰寫新的旅遊分享"
    >
      <PenSquare size={22} />
    </button>
  );
}
