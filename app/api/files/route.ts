import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// Base directory for file operations
const PUBLIC_DIR = path.join(process.cwd(), "public");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dir = searchParams.get("dir") || "";
    const fullPath = path.join(PUBLIC_DIR, dir);

    // Ensure the path is within public directory
    if (!fullPath.startsWith(PUBLIC_DIR)) {
      return NextResponse.json(
        { error: "Invalid directory path" },
        { status: 400 }
      );
    }

    const files = await fs.readdir(fullPath, { withFileTypes: true });
    const fileList = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file.name);
        const stats = await fs.stat(path.join(fullPath, file.name));
        return {
          name: file.name,
          path: filePath,
          isDirectory: file.isDirectory(),
          size: stats.size,
          modified: stats.mtime,
        };
      })
    );

    return NextResponse.json({ files: fileList });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const action = formData.get("action") as string;
    const sourcePath = formData.get("path") as string;
    
    const fullSourcePath = path.join(PUBLIC_DIR, sourcePath);

    // Ensure the path is within public directory
    if (!fullSourcePath.startsWith(PUBLIC_DIR)) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400 }
      );
    }

    switch (action) {
      case "delete": {
        const stats = await fs.stat(fullSourcePath);
        if (stats.isDirectory()) {
          await fs.rm(fullSourcePath, { recursive: true });
        } else {
          await fs.unlink(fullSourcePath);
        }
        return NextResponse.json({ message: "File deleted successfully" });
      }

      case "rename": {
        const newName = formData.get("newName") as string;
        const newPath = path.join(path.dirname(fullSourcePath), newName);
        
        if (!newPath.startsWith(PUBLIC_DIR)) {
          return NextResponse.json(
            { error: "Invalid new path" },
            { status: 400 }
          );
        }

        await fs.rename(fullSourcePath, newPath);
        return NextResponse.json({ message: "File renamed successfully" });
      }

      case "move": {
        const destDir = formData.get("destination") as string;
        const destPath = path.join(PUBLIC_DIR, destDir, path.basename(sourcePath));
        
        if (!destPath.startsWith(PUBLIC_DIR)) {
          return NextResponse.json(
            { error: "Invalid destination path" },
            { status: 400 }
          );
        }

        await fs.rename(fullSourcePath, destPath);
        return NextResponse.json({ message: "File moved successfully" });
      }

      case "upload": {
        const file = formData.get("file") as File;
        const destPath = path.join(fullSourcePath, file.name);
        
        if (!destPath.startsWith(PUBLIC_DIR)) {
          return NextResponse.json(
            { error: "Invalid upload path" },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(destPath, buffer);
        return NextResponse.json({ message: "File uploaded successfully" });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Operation failed" },
      { status: 500 }
    );
  }
}