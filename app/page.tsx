import { HomeTemplate } from "@/components/home/HomeTemplate";
import { mainGameConfig } from "@/config/main-game";

export const metadata = {
  alternates: {
    canonical: mainGameConfig.seo.canonicalBase,
  },
  // 首页使用主游戏的默认配置
  // Homepage uses main game's default configuration
};

export default function Page() {
  return <HomeTemplate />;
}
