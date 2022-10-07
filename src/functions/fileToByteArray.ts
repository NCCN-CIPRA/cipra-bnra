function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    // Create file reader
    let reader = new FileReader();
    // Register event listeners
    reader.addEventListener("loadend", (e) => resolve(e.target?.result as ArrayBuffer));
    reader.addEventListener("error", reject);
    // Read file
    reader.readAsArrayBuffer(file);
  });
}

export default async function fileToByteArray(file: File) {
  return new Uint8Array(await readFile(file));
}
