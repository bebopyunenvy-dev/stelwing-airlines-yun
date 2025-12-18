import { PrismaClient, PostType, MediaType } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const log = console.log;

// 會員等級分佈
const levels = ["Green", "Silver", "Gold", "Platinum"] as const;

// 🚀 Unsplash 高質感旅遊頭像（可永久使用）
const avatarList = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", // 女生
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde", // 男生
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
];

// 🚀 10 位會員基本資料（first + last）
const memberNames = [
  ["語安", "Lin"],
  ["皓宇", "Chang"],
  ["Emily", "Chen"],
  ["昕柔", "Wang"],
  ["柏諺", "Liu"],
  ["Hannah", "Wu"],
  ["哲銘", "Huang"],
  ["嘉恩", "Tsai"],
  ["Yuki", "Kato"],
  ["Minho", "Park"],
];

// 🚀 國家 / 城市（隨機地點）
const countries = ["台灣", "日本", "韓國", "泰國"];
const cities = ["台北", "東京", "大阪", "首爾", "釜山", "曼谷", "清邁"];

// 🚀 生成隨機會員
async function generateMembers() {
  log("🌱 建立 10 位會員中…");

  const members = [];

  for (let i = 0; i < 10; i++) {
    const [firstName, lastName] = memberNames[i];
    const email = `user${i + 1}@stelwing.com`;

    const hashed = await bcrypt.hash("Aa123456", 10);

    const member = await prisma.member.upsert({
    where: { email },
    update: {},
    create: {
        firstName,
        lastName,
        username: `${firstName.toLowerCase()}${i + 1}`,
        email,
        password: hashed,
        gender: (i % 2 === 0 ? "F" : "M") as any, // Gender enum: M / F
        country: countries[Math.floor(Math.random() * countries.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        avatarChoice: null,
        mileage: Math.floor(Math.random() * 20000),
        membershipLevel: levels[Math.floor(Math.random() * levels.length)] as any,
        isVerified: true,
    },
    });


    members.push(member);
  }

  log("✅ 會員建立完成！");
  return members;
}
// -------------------------------
// 📸 Unsplash 旅遊圖片素材（遊記 / 隨手拍）
// -------------------------------
const travelImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // 海邊
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308", // 日本街道
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // 山景
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", // 歐洲街景
  "https://images.unsplash.com/photo-1519817650390-64a93db511aa", // 城市夜景
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e", // 瀑布
  "https://images.unsplash.com/photo-1500048993953-d23a436266cf", // 森林
  "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef", // 咖啡廳
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e", // 山林步道
  "https://images.unsplash.com/photo-1503264116251-35a269479413", // 海岸公路
];

// -------------------------------
// 🎥 影片（YouTube embed）
// -------------------------------
const travelVideos = [
  "https://www.youtube.com/embed/ysz5S6PUM-U",
  "https://www.youtube.com/embed/Scxs7L0vhZ4",
  "https://www.youtube.com/embed/jfKfPfyJRdk",
  "https://www.youtube.com/embed/aqz-KE-bpKQ",
  "https://www.youtube.com/embed/hhw3L2Zc7E8",
];

// -------------------------------
// 🏷 Tags（自動建立常見旅遊標籤）
// -------------------------------
const tagList = [
  "美食", "自然風景", "街拍", "咖啡廳", "夜景",
  "海邊", "山岳", "文化", "城市探索", "紀錄片"
];

async function seedTags() {
  log("🌱 建立 Tags…");
  const tags = [];
  for (let name of tagList) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tags.push(tag);
  }
  return tags;
}

// -------------------------------
// 📝 遊記文章自動生成（Travel）
// -------------------------------
function generateTravelContent(): string {
  const paragraphs = [
    "這次旅行本來沒有特別計畫，只想找個地方放鬆，沒想到卻收穫了好多意外的驚喜。",
    "沿著街道漫步，可以感受到當地人的生活節奏，無論是咖啡廳的香氣，還是路邊攤的煙火味，都讓人留戀。",
    "我們在黃昏前抵達景點，夕陽灑落在地平線，整片天空像是被畫家潑上金色油彩，美得讓人說不出話。",
    "這裡的食物真的很棒，每一口都是味蕾的冒險，尤其是當地特色料理，讓人想再點一份。",
    "時間在旅行中過得特別快，每一天都充滿了不同的故事，讓我更加喜歡這種自由的感覺。",
    "旅行的價值不是目的地，而是每個瞬間；不是相機裡的照片，而是記憶中的溫度。",
  ];

  const count = Math.floor(Math.random() * 3) + 3; // 3–6 段
  return Array.from({ length: count })
    .map(() => paragraphs[Math.floor(Math.random() * paragraphs.length)])
    .join("\n\n");
}

// -------------------------------
// 📷 隨手拍短文（Snapshot）
// -------------------------------
function generateSnapshotCaption(): string {
  const captions = [
    "路過的每個瞬間都值得被記住。",
    "光剛剛好，風也剛剛好。",
    "把今天的美好偷偷拍下來。",
    "旅行中的小確幸。",
    "沒有故事，就是想拍而已。",
  ];
  return captions[Math.floor(Math.random() * captions.length)];
}

// -------------------------------
// 🎬 影片文案
// -------------------------------
function generateVideoDescription(): string {
  const lines = [
    "這支影片記錄了這趟旅程最精彩的部分，希望你們會喜歡！",
    "用鏡頭留下最真實的旅行感動。",
    "第一次嘗試用影片方式記錄旅程，歡迎留言告訴我想看什麼！",
    "把最美的瞬間剪成影片，心裡都暖暖的。",
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

// -------------------------------
// ✈️ 建立文章 / 圖片 / 標籤
// -------------------------------
async function generatePosts(members: any[], tags: any[]) {
  log("🌱 建立旅遊文章中…");

  const posts = [];

  for (let i = 0; i < 30; i++) {
    const author = members[Math.floor(Math.random() * members.length)];
    const postType =
      i % 3 === 0 ? PostType.travel :
      i % 3 === 1 ? PostType.video :
                    PostType.snapshot;

    const location = cities[Math.floor(Math.random() * cities.length)];
    const title = 
      postType === PostType.travel
        ? `旅途中的小故事`
        : postType === PostType.video
          ? `旅遊影片分享`
          : `隨手拍`;

    // 先建立 TravelPost
    const content =
    postType === PostType.travel
        ? generateTravelContent()
        : postType === PostType.video
        ? generateVideoDescription()
        : generateSnapshotCaption();

    const post = await prisma.travelPost.create({
    data: {
        authorId: author.memberId,
        postType,
        title,
        content,
        summary: generateSummary(content),  // ⭐ 新增
        location,
    },
    });


    // 建立 media（1～5 張，或影片）
    if (postType === PostType.video) {
      await prisma.mediaItem.create({
        data: {
          postId: post.postId,
          mediaType: MediaType.video,
          mediaUrl: travelVideos[Math.floor(Math.random() * travelVideos.length)],
          thumbnailUrl: travelImages[Math.floor(Math.random() * travelImages.length)],
        },
      });
    } else {
      const mediaCount = Math.floor(Math.random() * 3) + 1; // 1–3 張
      for (let m = 0; m < mediaCount; m++) {
        await prisma.mediaItem.create({
          data: {
            postId: post.postId,
            mediaType: MediaType.image,
            mediaUrl: travelImages[Math.floor(Math.random() * travelImages.length)],
          },
        });
      }
    }

    // Tag（1–3 個，避免重複）
// Tag（1–3 個，避免重複）
const tagCount = Math.floor(Math.random() * 3) + 1;

// 隨機打亂 tags
const shuffled = [...tags].sort(() => 0.5 - Math.random());

// 取前 N 個（保證不重複）
const selectedTags = shuffled.slice(0, tagCount);

for (let tg of selectedTags) {
  await prisma.postTag.create({
    data: {
      postId: post.postId,
      tagId: tg.tagId,
    },
  });
}

    posts.push(post);
  }

  log("✅ 文章 & 媒體建立完成！");
  return posts;
}
// -------------------------------
// 💬 留言內容池（真實感 & 自然）
// -------------------------------
const commentTexts = [
  "這張照片真的太美了！😍",
  "看起來超想去～～",
  "原來這裡這麼漂亮，下次也要來！",
  "拍得好有感覺 👍",
  "影片剪得太好了吧！！",
  "感謝分享～收藏起來！",
  "好療癒的旅程🥺",
  "這個景點我也去過！超推！",
  "請問是用什麼相機拍的呢？",
  "色調好喜歡！",
  "看了你的文章突然也想出國 😂",
];

// -------------------------------
// 💬 自動建立留言（每篇 3～10 則）
// -------------------------------
async function generateComments(posts: any[], members: any[]) {
  log("🌱 建立留言中…");

  for (const post of posts) {
    const commentCount = Math.floor(Math.random() * 7) + 3; // 3–10 則留言

    const createdComments: any[] = [];

    for (let i = 0; i < commentCount; i++) {
      const user = members[Math.floor(Math.random() * members.length)];
      const content =
        commentTexts[Math.floor(Math.random() * commentTexts.length)];

      // 10% 機率是回覆留言（nested comment）
      const isReply = createdComments.length > 0 && Math.random() < 0.1;
      const parent = isReply
        ? createdComments[
            Math.floor(Math.random() * createdComments.length)
          ]
        : null;

      const comment = await prisma.comment.create({
        data: {
          postId: post.postId,
          userId: user.memberId,
          content,
          parentId: parent ? parent.commentId : null,
        },
      });

      createdComments.push(comment);
    }
  }

  log("✅ 留言建立完成！");
}

// -------------------------------
// 🚀 main()：整個流程
// -------------------------------
async function main() {
  log("🔥 開始建立旅遊分享假資料…");

  // Step 1. 清空舊資料（可選）→ 我用 safe 模式，不會 drop member
  await prisma.postTag.deleteMany();
  await prisma.mediaItem.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.travelPost.deleteMany();

  log("🧹 已清除舊文章相關資料！");

  // Step 2. 會員資料
  const members = await generateMembers();

  // Step 3. Tag 資料
  const tags = await seedTags();

  // Step 4. 文章 + Media + Tag
  const posts = await generatePosts(members, tags);

  // Step 5. 留言
  await generateComments(posts, members);

  log("🎉 旅遊分享假資料全部建立完成！");
}

// -------------------------------
// ▶️ 執行 main()
// -------------------------------
main()
  .catch((e) => {
    console.error("❌ 種子錯誤：", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    log("🔌 已關閉資料庫連線");
  });
