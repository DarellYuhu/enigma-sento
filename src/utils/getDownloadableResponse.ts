import { AxiosResponse } from "axios";

export const getDownloadableResponse = (response: AxiosResponse) => {
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  // Extract filename from Content-Disposition if available
  const contentDisposition = response.headers["content-disposition"];
  let fileName = "downloaded-file";
  if (contentDisposition) {
    const match = contentDisposition.match(/filename\*?=([^;]+)/);
    if (match) fileName = match[1].trim().replace(/^["']|["']$/g, "");
  }

  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
