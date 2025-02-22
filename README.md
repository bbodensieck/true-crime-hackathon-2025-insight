# true-crime-hackathon-2025-insight

## Set- up 
* auf deinem System muss poetry installiert sein. Poetry Version >= 2.0.1  
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
