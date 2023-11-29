export default class WebWorker extends Worker {
  constructor(worker: any) {
    const code = worker.toString();
    const blob = new Blob(["(" + code + ")()"]);

    super(new URL("./calculator.worker.ts", import.meta.url));
  }
}
