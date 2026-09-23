/**
 * 收集所有场景旁白 → 调用本机 Breeze TTS API → 写出 public/narration/*.wav
 *
 * 用法：
 *   1) 先启动 TTS 服务：npm run tts:server
 *   2) npm run tts:generate
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "public", "narration");
const MANIFEST_PATH = path.join(OUT_DIR, "manifest.json");

const TTS_URL = process.env.BREEZE_TTS_URL ?? "http://127.0.0.1:7860/v1/audio/speech";
const SAMPLE_RATE = 24000;
const TEACHER_VOICE_INSTRUCTION =
  "一位耐心清晰的算法课教师，男声，语速适中偏慢，吐字清楚，像在课堂上给学生讲解数据结构，语气亲切专业，略带鼓励。";

const hashCaption = (text) => {
  const normalized = text.trim().replace(/\s+/g, " ");
  return createHash("sha1").update(normalized, "utf8").digest("hex").slice(0, 12);
};

/** 把 16-bit LE PCM 包成 WAV */
const pcmToWav = (pcm, sampleRate = SAMPLE_RATE, channels = 1) => {
  const bits = 16;
  const blockAlign = (channels * bits) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcm.length;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bits, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  pcm.copy(buffer, 44);
  return buffer;
};

/** 动态 import 场景注册表（TS 经 tsx/vite-node 或先收集 JSON） */
const collectCaptionsFromSources = () => {
  const scenesDir = path.join(ROOT, "src", "scenes");
  const captions = new Set();
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        walk(full);
        continue;
      }
      if (!name.endsWith(".tsx") && !name.endsWith(".ts")) continue;
      const src = fs.readFileSync(full, "utf8");
      const re = /caption:\s*`([^`]+)`|caption:\s*"([^"]+)"|caption:\s*'([^']+)'/g;
      let m;
      while ((m = re.exec(src))) {
        const text = (m[1] ?? m[2] ?? m[3] ?? "").trim();
        if (text) captions.add(text.replace(/\s+/g, " "));
      }
    }
  };
  walk(scenesDir);
  return [...captions];
};

const synthesize = async (text) => {
  const form = new FormData();
  form.append("text", text);
  form.append("instruction", TEACHER_VOICE_INSTRUCTION);
  form.append("cfg_scale", "4");
  form.append("seed", "42");

  const res = await fetch(TTS_URL, { method: "POST", body: form });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TTS ${res.status}: ${body.slice(0, 300)}`);
  }
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
};

const main = async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const captions = collectCaptionsFromSources();
  console.log(`共收集旁白 ${captions.length} 句`);

  // 健康检查
  try {
    const ping = await fetch(TTS_URL.replace(/\/v1\/audio\/speech$/, "/"), {
      method: "GET",
    });
    console.log(`TTS 服务可达（status ${ping.status}）`);
  } catch (err) {
    console.error(
      "无法连接 Breeze TTS。请先运行：npm run tts:server\n",
      err.message,
    );
    process.exit(1);
  }

  const files = {};
  let i = 0;
  for (const caption of captions) {
    i += 1;
    const id = hashCaption(caption);
    const fileName = `${id}.wav`;
    const outPath = path.join(OUT_DIR, fileName);
    files[caption] = `narration/${fileName}`;

    if (fs.existsSync(outPath) && process.env.TTS_FORCE !== "1") {
      console.log(`[${i}/${captions.length}] 跳过已存在 ${fileName}`);
      continue;
    }

    console.log(`[${i}/${captions.length}] 合成：${caption.slice(0, 28)}…`);
    try {
      const pcm = await synthesize(caption);
      const wav = pcmToWav(pcm);
      fs.writeFileSync(outPath, wav);
    } catch (err) {
      console.error(`失败：${caption}\n`, err.message);
    }
  }

  const manifest = {
    files,
    sampleRate: SAMPLE_RATE,
    voiceInstruction: TEACHER_VOICE_INSTRUCTION,
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`已写入 ${MANIFEST_PATH}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
