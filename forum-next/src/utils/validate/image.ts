export function checkImg(url: string, maxWidth: number, maxHeight: number) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.src = url
    img.onload = () => {
      if (img.width < maxWidth || img.height < maxHeight) {
        reject(new Error('图片宽度*高度至少为150*150像素!'))
      } else {
        resolve('')
      }
    }
  })
}