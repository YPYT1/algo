# 在 WSL 中启动本机 Breeze TTS 2 API（端口 7860）
# 模型：E:\model\tts\Breeze-TTS-2
# 推理代码：E:\model\tts\breeze-tts

$ErrorActionPreference = "Stop"

$ModelWin = "E:\model\tts\Breeze-TTS-2"
$CodeWin = "E:\model\tts\breeze-tts"

if (-not (Test-Path $ModelWin)) { throw "找不到模型目录：$ModelWin" }
if (-not (Test-Path $CodeWin)) { throw "找不到推理代码：$CodeWin（请先 git clone breezebblue-ai/breeze-tts）" }

Write-Host "通过 WSL Ubuntu 启动 Breeze TTS API …"
Write-Host "模型: $ModelWin"
Write-Host "代码: $CodeWin"
Write-Host "API:  http://127.0.0.1:7860/v1/audio/speech"
Write-Host ""

# 首次会 pip install；已安装则很快
$bash = @'
set -e
cd /mnt/e/model/tts/breeze-tts
if [ ! -d .venv ]; then
  python3 -m venv .venv
  . .venv/bin/activate
  pip install -U pip
  pip install -r requirements.txt
else
  . .venv/bin/activate
fi
python -m breeze_infer.api /mnt/e/model/tts/Breeze-TTS-2 --host 0.0.0.0 --port 7860
'@

wsl -d Ubuntu-24.04 -- bash -lc $bash
