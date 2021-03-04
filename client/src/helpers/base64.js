export async function getBase64(filedata) {
  const datas = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(filedata);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  return datas.then((r) => r);
}

export async function resizeImageBase64(filedata, maxWidth, maxHeight) {
  const datas = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(filedata);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const elem = document.createElement("canvas");

        // img.width and img.height will contain the original dimensions
        let width = img.width;
        let height = img.height;

        // reduce proportionally
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);
        const dataURI = ctx.canvas.toDataURL("image/jpeg");

        // This is the return of the Promise
        resolve(dataURI);
      };
    };
    reader.onerror = (error) => reject(error);
  });

  return datas.then((r) => r);
} //
