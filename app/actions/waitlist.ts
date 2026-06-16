"use server";

import { promises as fs } from "node:fs";
import path from "node:path";

// MVP: 대기자 이메일을 로컬 JSON 파일에 저장합니다.
// 추후 Supabase 등 외부 DB로 교체할 때 이 함수의 "저장" 부분만 바꾸면 됩니다.
const WAITLIST_PATH = path.join(process.cwd(), "data", "waitlist.json");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message?: string;
};

type WaitlistEntry = {
  email: string;
  createdAt: string;
};

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const raw = await fs.readFile(WAITLIST_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WaitlistEntry[]) : [];
  } catch {
    return [];
  }
}

async function writeWaitlist(entries: WaitlistEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(WAITLIST_PATH), { recursive: true });
  await fs.writeFile(WAITLIST_PATH, JSON.stringify(entries, null, 2), "utf-8");
}

export async function addToWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    return { status: "error", message: "이메일을 입력해 주세요." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { status: "error", message: "올바른 이메일 형식이 아닙니다." };
  }

  try {
    const entries = await readWaitlist();
    if (entries.some((e) => e.email === email)) {
      return { status: "error", message: "이미 등록된 이메일입니다." };
    }

    entries.push({ email, createdAt: new Date().toISOString() });
    await writeWaitlist(entries);

    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "잠시 후 다시 시도해 주세요.",
    };
  }
}
