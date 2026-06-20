import "server-only";

// 이 모듈은 서버에서만 import 되어야 합니다(OPENROUTER_API_KEY 노출 방지).
// 위의 "server-only" import가 클라이언트 번들에 들어오면 빌드가 실패합니다.

// AI 정리 결과의 타입입니다. 아래 json_schema와 1:1로 대응합니다.
export type ReadingDigest = {
  summary: string;
  themes: {
    title: string;
    insight: string;
    tags: string[];
    note_indexes: number[];
  }[];
  today_step: {
    action: string;
    why: string;
    based_on: string;
  };
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-opus-4.8";

// 요구사항에 명시된 시스템 프롬프트를 그대로 사용합니다.
const SYSTEM_PROMPT = `당신은 자기계발 독서가를 돕는 사려 깊은 독서 코치입니다.
사용자가 한 권의 책을 읽으며 남긴 흩어진 메모(밑줄·생각)를 받아 다음을 합니다.
1) 메모를 2~4개의 주제로 묶어 정리한다.
2) 각 주제에 핵심 통찰과 키워드 태그를 붙인다.
3) 사용자가 '오늘 당장' 실천할 수 있는 '오늘의 한 걸음'을 단 하나 제안한다.
[규칙]
- 반드시 제공된 메모에 근거해서만 작성한다. 메모에 없는 사실·인용·내용을 지어내지 않는다.
- 주제는 메모를 그대로 복사하지 말고, 여러 메모를 엮어 한 단계 높은 통찰로 합성한다.
- '오늘의 한 걸음'은 반드시: 구체적이고 작아야 하고(오늘, 몇 분 내 가능),
  마음가짐이 아니라 눈에 보이는 행동이어야 하며, 사용자의 메모와 분명히 연결돼야 한다.
  "꾸준히 독서하세요" 같은 누구에게나 통하는 뻔한 말은 절대 금지한다.
- 모든 출력은 한국어로 따뜻하고 간결하게 쓴다.
- 메모가 부실해도 있는 내용 안에서 최선을 다하되 없는 걸 만들지 않는다.
- 출력은 아래 스키마에 맞는 유효한 JSON만 반환한다(마크다운·설명·코드펜스 없이).`;

// OpenRouter에 전달할 response_format. strict json_schema를 사용합니다.
// (minItems/maxItems는 넣지 않고, 주제 개수 제한은 시스템 프롬프트로만 지시합니다.)
const RESPONSE_FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "reading_digest",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["summary", "themes", "today_step"],
      properties: {
        summary: { type: "string" },
        themes: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["title", "insight", "tags", "note_indexes"],
            properties: {
              title: { type: "string" },
              insight: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
              note_indexes: { type: "array", items: { type: "integer" } },
            },
          },
        },
        today_step: {
          type: "object",
          additionalProperties: false,
          required: ["action", "why", "based_on"],
          properties: {
            action: { type: "string" },
            why: { type: "string" },
            based_on: { type: "string" },
          },
        },
      },
    },
  },
} as const;

type CreateDigestInput = {
  title: string;
  author: string | null;
  notes: { content: string }[];
};

// 코드펜스(```json ... ```)나 앞뒤 잡텍스트가 섞여 와도 JSON 본문만 뽑아냅니다.
function stripToJson(raw: string): string {
  let text = raw.trim();
  // ```json ... ``` 또는 ``` ... ``` 펜스 제거
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence) {
    text = fence[1].trim();
  }
  // 첫 '{' 부터 마지막 '}' 까지만 취합니다.
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    text = text.slice(first, last + 1);
  }
  return text;
}

// 모델을 1회 호출하고, content 문자열을 ReadingDigest로 파싱해 반환합니다.
// 파싱 실패 시 throw 하여 호출부에서 재시도할 수 있게 합니다.
async function callOnce(
  apiKey: string,
  model: string,
  userPrompt: string,
): Promise<ReadingDigest> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // OpenRouter 대시보드 식별용(선택). 노출돼도 무방한 값입니다.
      "X-Title": "Reading Log",
    },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      response_format: RESPONSE_FORMAT,
      // 개인정보 보호: 데이터를 수집하지 않는 제공자로만 라우팅(ZDR/비수집).
      provider: { data_collection: "deny" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${detail.slice(0, 500)}`);
  }

  const payload = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter 응답에 content가 없습니다.");
  }

  return JSON.parse(stripToJson(content)) as ReadingDigest;
}

// 메모를 1·2·3… 번호로 매겨 user 메시지를 구성하고, AI 정리를 생성합니다.
// 파싱 실패 시 1회 재시도하고, 그래도 실패하면 throw 합니다.
export async function createDigest({
  title,
  author,
  notes,
}: CreateDigestInput): Promise<ReadingDigest> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY가 설정되지 않았습니다.");
  }
  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  const numbered = notes
    .map((n, i) => `${i + 1}. ${n.content}`)
    .join("\n");

  const userPrompt = `책: ${title}${author ? ` — ${author}` : ""}
다음은 이 책을 읽으며 남긴 메모입니다.
[메모]
${numbered}
이 메모들을 정리하고, 오늘의 한 걸음을 제안해줘.`;

  try {
    return await callOnce(apiKey, model, userPrompt);
  } catch {
    // 1회 재시도 (JSON 파싱 실패 또는 일시적 오류 대비)
    return await callOnce(apiKey, model, userPrompt);
  }
}
