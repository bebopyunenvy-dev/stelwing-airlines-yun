'use client';

import Image from 'next/image';

// export interface NotLoggedPageProps {}
// {}: NotLoggedPageProps

export default function NotLoggedPage() {
  return (
    <>
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="sw-h5">規劃讓你的旅程更完美</div>
        <div className="sw-h5">登入會員後即可使用</div>
        <Image
          src="/images/planner/introduce_function.jpeg"
          alt="Stelwing private jet"
          // 這裡給一個「大於你實際顯示」的 intrinsic 尺寸，避免被放大而糊掉
          width={1600}
          height={900}
          priority
          sizes="(min-width:1280px) 560px, (min-width:1024px) 520px, (min-width:768px) 460px, 320px"
          className="
                          w-[320px]           /* 手機 */
                          sm:w-[380px]        /* 小平板 */
                          md:w-[460px]        /* 平板 */
                          lg:w-[520px]        /* 桌機 */
                          xl:w-[560px]        /* 大桌機 */
                          h-auto
                          object-contain
                          object-right
                          drop-shadow-[0_18px_28px_rgba(0,0,0,0.30)]
                          mt-6
                        "
        />
      </div>
    </>
  );
}
