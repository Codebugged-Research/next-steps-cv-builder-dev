import { CV } from "../models/cv.model.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateCVPDF } from "../services/generatepdf.js";


const createOrUpdateCV = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    const existingUserCV = await CV.findOne({ userId });
    if (existingUserCV) {
        const updatedCV = await CV.findOneAndUpdate({ userId }, { $set: req.body }, { new: true });
        return res.status(200).json(new ApiResponse(200, updatedCV, "CV updated successfully"));
    }
    else {
        const newCV = await CV.create(req.body);
        return res.status(201).json(new ApiResponse(201, newCV, "CV created successfully"));
    }
})

const getCV = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const cv = await CV.findOne({ userId }).populate("userId", "fullName email");

    if (!cv) {
        throw new ApiError(404, "CV not found for this user");
    }

    return res.status(200).json(
        new ApiResponse(200, cv, "CV retrieved successfully")
    );
});

const uploadGovCV = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    if (!req.file) {
        throw new ApiError(400, "Government CV file is required");
    }
    
    if (!req.file.gridfsId) {
        throw new ApiError(500, "File upload to GridFS failed");
    }
    
    const govCVData = {
        userId: userId,
        originalName: req.file.originalname,
        filename: req.file.gridfsFilename,
        fileId: req.file.gridfsId, 
        size: req.file.size,
        uploadDate: new Date(),
        type: 'government',
        status: 'pending'
    };
    
    const existingGovCV = await CV.findOne({
        userId,
        'govCV.type': 'government'
    });
    
    if (existingGovCV) {
        const updatedCV = await CV.findOneAndUpdate(
            { userId },
            {
                $set: {
                    'govCV': govCVData,
                    lastModified: new Date()
                }
            },
            { new: true }
        );
        return res.status(200).json(new ApiResponse(200, updatedCV, "Government CV uploaded successfully"));
    } else {
        const existingCV = await CV.findOne({ userId });
        
        if (existingCV) {
            const updatedCV = await CV.findOneAndUpdate(
                { userId },
                {
                    $set: {
                        govCV: govCVData,
                        lastModified: new Date()
                    }
                },
                { new: true }
            );
            return res.status(200).json(new ApiResponse(200, updatedCV, "Government CV uploaded successfully"));
        } else {
            const newCV = await CV.create({
                userId: userId,
                govCV: govCVData,
            });
            return res.status(201).json(new ApiResponse(201, newCV, "Government CV uploaded and record created successfully"));
        }
    }
});

const downloadCVPDF = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id;
        
        console.log('==========================================');
        console.log('Downloading CV for userId:', userId);
        
        // FIX: Use 'userId' instead of 'user'
        const cvData = await CV.findOne({ userId: userId });
        
        if (!cvData) {
            console.log('❌ CV not found in database');
            return res.status(404).json({
                success: false,
                message: 'CV not found for this user'
            });
        }
        
        console.log('✅ CV Data found');
        
        console.log('Generating PDF...');
        const pdfBuffer = await generateCVPDF(cvData);
        
        console.log('✅ PDF generated successfully, buffer length:', pdfBuffer.length);
        
        // Check if basicDetails exists
        if (!cvData.basicDetails || !cvData.basicDetails.fullName) {
            console.log('❌ Missing basic details');
            return res.status(400).json({
                success: false,
                message: 'CV is missing basic details'
            });
        }
        
        const filename = `${cvData.basicDetails.fullName.replace(/\s+/g, '_')}_CV.pdf`;
        console.log('Sending PDF with filename:', filename);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        res.send(pdfBuffer);
        console.log('✅ PDF sent successfully');
        console.log('==========================================');
        
    } catch (error) {
        console.error('❌ Download CV Error Details:', error.message);
        console.error('Error stack:', error.stack);
        console.error('==========================================');
        
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};
export {
    createOrUpdateCV,
    getCV,
    uploadGovCV,
    downloadCVPDF
}