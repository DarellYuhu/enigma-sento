export const getNewFileName = (file: File) => {
  const randomNumber = Math.floor(Math.random() * 1000);
  const newName = `${Date.now()}_${randomNumber}_${file.name}`;
  return new File([file], newName, { type: file.type });
};
