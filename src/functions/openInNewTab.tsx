export default function openInNewTab(url: string, name: string = "newwindow"): void {
  window.open(url, name, "width=1300,height=900");
}
