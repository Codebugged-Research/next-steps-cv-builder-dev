import { s3 } from '../middlewares/s3.upload.middleware.js';

export const uploadFile = async (req, res) => {
  try {
    console.log('req.file:', req.file); // debug

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const fileUrl = req.file.location; 
    const fileKey = req.file.key;

    res.status(200).json({
      success: true,
      data: {
        url: fileUrl,
        key: fileKey,
        message: 'File uploaded successfully'
      }
    });
  } catch (error) {
    console.error('UploadFile Error:', error); // debug full error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteFile = async (req, res) => {
    try {
        const { fileKey } = req.params;

        const deleteParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey
        };

        await s3.deleteObject(deleteParams).promise();

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};