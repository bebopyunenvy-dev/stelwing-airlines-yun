import { prisma } from "../src/utils/prisma-only.js";

async function main() {
  await prisma.avatarOption.createMany({
    data: [
      { imagePath: "/avatars/avatar1.png", label: "頭像 1" },
      { imagePath: "/avatars/avatar2.png", label: "頭像 2" },
      { imagePath: "/avatars/avatar3.png", label: "頭像 3" },
      { imagePath: "/avatars/avatar4.png", label: "頭像 4" },
      { imagePath: "/avatars/avatar5.png", label: "頭像 5" },
      { imagePath: "/avatars/avatar6.png", label: "頭像 6" },
      { imagePath: "/avatars/avatar7.png", label: "頭像 7" },
      { imagePath: "/avatars/default.png", label: "預設頭像" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Avatar 資料已建立完成！");
}

main()
  .catch((err) => {
    console.error("❌ Seed Avatar 錯誤：", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
