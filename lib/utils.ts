import { createCn } from "cn/config"

/**
 * 클래스 병합. 디자인시스템의 커스텀 토큰(글자 크기·자간·모서리 이름)을 알려 줘야
 * `text-body-md`를 글자색으로 오해해 지우거나, 기본 `text-sm`과 충돌을 못 풀지 않는다.
 */
export const cn = createCn({
  extend: {
    theme: {
      radius: ["card", "pill"],
    },
    classGroups: {
      "font-size": [{ text: ["display", "headline", "body-lg", "body-md", "body-sm", "label-md", "label-sm"] }],
      tracking: [{ tracking: ["display", "headline"] }],
    },
  },
})
