import whisper_timestamped as whisper
import json

from pyannote.audio import Pipeline
import torch

from ollama import chat
from ollama import ChatResponse


# convert video to audio: ffmpeg -i <infile> -ac 2 -f wav <outfile>
file = "/home/alex/Downloads/PXL_20250222_123802359.wav"
audio = whisper.load_audio(file)
model = whisper.load_model("large", device="cpu")
result = whisper.transcribe(model, audio, language="de", vad=True)

def format_timestamp(seconds: float, always_include_hours: bool = False, decimal_marker: str = '.'):
    assert seconds >= 0, "non-negative timestamp expected"
    milliseconds = round(seconds * 1000.0)

    hours = milliseconds // 3_600_000
    milliseconds -= hours * 3_600_000

    minutes = milliseconds // 60_000
    milliseconds -= minutes * 60_000

    seconds = milliseconds // 1_000
    milliseconds -= seconds * 1_000

    hours_marker = f"{hours:02d}:" if always_include_hours or hours > 0 else ""
    return f"{hours_marker}{minutes:02d}:{seconds:02d}{decimal_marker}{milliseconds:03d}"


# ----- Annotate Speaker ------ #

pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    use_auth_token="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")
pipeline.to(torch.device("cpu"))
diarization = pipeline(audio)

for turn, _, speaker in diarization.itertracks(yield_label=True):
    print(f"start={turn.start:.1f}s stop={turn.end:.1f}s speaker_{speaker}")

#speaker = diarization.itertracks(yield_label=True)
#idx = 0
#offset = 2
#for segment in result["segments"]:
#    if segment["start"] - offset < speaker[idx][0].satrt:
#        
#
#
## ---- Ausgabe ---- #
#
## Erstelle ein leeres Array (Liste)
#json_array = []
#
## Erstelle ein JSON-Objekt (Dictionary) und füge es dem Array hinzu
#for segment in result["segments"]:
#    json_array.append({
#        "start": segment['start'],
#        "end": segment['end'],
#        "personID": 0,
#        "text": segment['text'].strip().replace('-->', '->')
#    })
#
#print(json.dumps(json_array, indent=4, ensure_ascii=False))


# ---- Olama Anbindung ---- #
exit()
str = ""
for segment in result["segments"]:
    #str +=  f"{format_timestamp(segment['start'])} --> {format_timestamp(segment['end'])} \n {segment['text'].strip().replace('-->', '->')}\n\n"
    str +=  f"{segment['text'].strip().replace('-->', '->')} \n"

promt = f'Anbei ist ein Transkript einer Polizei Bodycam. Fasse zur polizeilichen Dokumentation dieses Transkript in Professioneller Form einem Fließtext zusammen. Bleibe dabei sachlich und beziehe dich ausschließlich auf das Transkript, ohne fremte Informationen oder Schlussfolgerrungen mit einzubeziehen!!! Erwähne dabei auch Beschimpfungen und mögliche Straftaten. Stelle keine Rückfragen, gebe keine Einleitungs oder ausleitungssätze!!! Führe keine Interpretationen oder Aaalysen durch!!! \n\n {str}'

#print(json.dumps(result, indent = 2, ensure_ascii = False))
#print(result["text"])
#print(promt)
print("\n\n")

model = 'qwen2.5:0.5b'
model = 'llava:13b'
#model = 'deepseek-r1:7b'
response: ChatResponse = chat(model=model, messages=[
  {
    'role': 'user',
    'content': promt
  },
])

print(f"\n\n {model} LLM Output:")
print(response['message']['content'])
# or access fields directly from the response object
#print(response.message.content)