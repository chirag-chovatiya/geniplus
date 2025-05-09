import { Client } from "basic-ftp";
import { Readable } from "stream";

export const uploadFilesToFTP = async (files, folderName) => {
  const client = new Client();
  client.ftp.verbose = true;

  const ftpConfig = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    port: parseInt(process.env.FTP_PORT, 10) || 21,
  };

  try {
    await client.access(ftpConfig);

    const directoryList = await client.list();
    const folderExists = directoryList.some((item) => item.name === folderName);

    if (!folderExists) {
      await client.ensureDir(folderName);
    }
    await client.cd(folderName);

    const uploadedFileUrls = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = file.name.replace(/\\/g, "").replace(/\//g, "");
      const bufferStream = new Readable();
      bufferStream.push(buffer);
      bufferStream.push(null);

      await client.uploadFrom(bufferStream, filename);

      const fileUrl = `https://laxyaacademy.com/exam/${folderName}/${filename}`;
      uploadedFileUrls.push(fileUrl);
    }

    await client.close();
    return { success: true, urls: uploadedFileUrls };
  } catch (error) {
    console.log("FTP Upload Error:", error);
    return { success: false, error: "FTP Upload Failed" };
  }
};
