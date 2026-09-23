# 教师有声旁白（Breeze TTS 2）

旁白会跟着每个分镜的中文讲解同步朗读，像老师讲算法。

## 三种声音来源（自动降级）

1. **预生成 wav**（`public/narration/*.wav`）— Remotion 与观看页都播这个  
2. **本机 Breeze-TTS-2 API**（`http://127.0.0.1:7860`）— 观看页实时合成  
3. **浏览器 SpeechSynthesis** — 没开 TTS 服务时也能出声

## 一次性准备

模型已在：`E:\model\tts\Breeze-TTS-2`  
推理代码已在：`E:\model\tts\breeze-tts`

### 1. 启动 TTS 服务（WSL + GPU）

```powershell
cd D:\Project\algo\remotion\code-hike
npm run tts:server
```

首次会在 WSL 里建 venv 并 `pip install`（较久）。之后启动模型约占用 ~8GB 显存。

### 2. 批量生成全部旁白（可选，推荐）

另开一个终端：

```powershell
npm run tts:generate
```

会把所有场景旁白写成 `public/narration/*.wav` + 更新 `manifest.json`。

### 3. 观看（带声音）

```powershell
npm run watch
```

打开 http://localhost:3333/ ，左侧勾选「开启教师旁白」。

## 教师音色

Voice Design 指令（可改 `scripts/tts/generate.mjs` / `src/narration/hash.ts`）：

> 一位耐心清晰的算法课教师，男声，语速适中偏慢，吐字清楚，像在课堂上给学生讲解数据结构，语气亲切专业，略带鼓励。

## 注意

- Breeze 权重为研究/非商用许可，仅本地学习使用。  
- Windows 上通过 WSL 跑官方 Linux 推理；API 映射到 `127.0.0.1:7860`。  
- 强制重生成：`$env:TTS_FORCE=1; npm run tts:generate`
