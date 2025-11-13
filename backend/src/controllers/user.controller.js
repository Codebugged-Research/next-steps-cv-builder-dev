import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/users.model.js';

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, fullName, phone, medicalSchool, graduationYear } = req.body;
    
    if (!email || !password || !fullName || !phone || !medicalSchool || !graduationYear) {
        throw new ApiError(400, 'All fields are required');
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }
    
    const user = await User.create({
        email,
        password,
        fullName,
        phone,
        medicalSchool,
        graduationYear
    });
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }
    
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };
    
    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

});

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const acceptHIPAAagreement = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.hipaaAgreement.isSigned) {
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {
                    isSigned: user.hipaaAgreement.isSigned,
                    signedAt: user.hipaaAgreement.signedAt
                },
                "HIPAA agreement already accepted"
            ));
    }
    await user.signHipaaAgreement(req.ip);
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                isSigned: user.hipaaAgreement.isSigned,
                signedAt: user.hipaaAgreement.signedAt,
                version: user.hipaaAgreement.version
            },
            "HIPAA agreement accepted successfully"
        ));
});

const getHIPAAstatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                isSigned: user.hipaaAgreement.isSigned,
                signedAt: user.hipaaAgreement.signedAt,
                version: user.hipaaAgreement.version
            },
            "HIPAA status fetched successfully"
        ));
});

export { loginUser , getCurrentUser , registerUser , logoutUser , acceptHIPAAagreement , getHIPAAstatus };