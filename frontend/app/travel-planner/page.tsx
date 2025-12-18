'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// export interface TravelPlannerPageProps {}
// {}: TravelPlannerPageProps

export default function TravelPlannerPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);

    if (token) {
      router.replace('/travel-planner/list');
    } else {
      router.replace('/travel-planner/not-logged');
    }
  }, [router]);

  return null;

  // return (
  //   <>
  //     <div>TravelPlanner Page</div>
  //     <div>
  //       這裡是黃蕾的旅遊規劃，希望大家都可以現在買好結訓後的機票來排行程
  //     </div>
  //     <div className="flex gap-[20px] m-6">
  //       <Link
  //         href="/travel-planner/not-logged"
  //         className="p-4 border border-solid border-black"
  //       >
  //         未登入
  //       </Link>
  //       <Link
  //         href="/travel-planner/list"
  //         className="p-4 border border-solid border-black"
  //       >
  //         有登入看列表
  //       </Link>
  //     </div>
  //     <div>這個頁面之後要判斷登入狀態後跳轉</div>
  //   </>
  // );
}
