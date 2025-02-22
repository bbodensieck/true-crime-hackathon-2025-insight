# true-crime-hackathon-2025-insight

## Set- up 
* auf deinem System muss poetry installiert sein. Poetry Version >= 2.0.1 
* außerdem: ffmpeg tested with version 4 (ubuntu), version 7 (macOS)
* dann das Repository clonen 
* wechsel in das Repository

## Poetry Environment 

Um das envrionment zu initialisieren:
```console
poetry install
```
Das nutzt die `pyproject.toml` Datei, um alle relevanten Packages zu installieren. 

Um ein neues Package zum environment hinzuzufügen:  
```console
poetry add [package name]
```
oder bei größeren Packages, die viele Dependendcies zusätzlich brauchen (zB pytroch oÄ)
```console  
poetry add -D [package name]
```
Das wird dann automatisch in das `pyproject.toml` geschrieben. 
Das musst du dann als nächstes committen mit einem Kommentar, welches Package hinzugefügt wurde.

## poetry - pytorch  
``` 
poetry source add --priority explicit pytorch_cpu https://download.pytorch.org/whl/cpu

poetry add --source pytorch_cpu torch==1.13.1+cpu torchaudio==0.13.1+cpu
```
