export default class WebWorker extends Worker {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor() {
    // const code = worker.toString();
    // const blob = new Blob(["(" + code + ")()"]);

    super(new URL("./export.worker.ts", import.meta.url));
  }
}
