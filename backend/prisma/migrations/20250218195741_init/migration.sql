-- CreateTable
CREATE TABLE "VideoClip" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" REAL NOT NULL
);

CREATE TABLE "Range" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "start" REAL NOT NULL,
    "end" REAL NOT NULL,
    "duration" REAL NOT NULL,
    "max_amplitude" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "video_clip_id" INTEGER NOT NULL,
    FOREIGN KEY ("video_clip_id") REFERENCES "VideoClip" ("id")
);

CREATE TABLE "Marker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "time" REAL NOT NULL,
    "event_type" TEXT NOT NULL,
    "video_clip_id" INTEGER NOT NULL,
    FOREIGN KEY ("video_clip_id") REFERENCES "VideoClip" ("id")
);

